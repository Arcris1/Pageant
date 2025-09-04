<?php

namespace App\Http\Controllers;

use App\Models\CandidateCriteria;
use App\Models\Criteria;
use App\Models\Pageant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScoreController extends Controller
{
    public function index()
    {
        $pageants = Pageant::all();

        return Inertia::render('Scoring/Index', [
            'pageants' => $pageants,
        ]);
    }

    public function showDetails(Pageant $pageant)
    {
        $roundCriterias = $pageant->criterias->groupBy('round')->sortKeys()->values()->all();

        return Inertia::render('Scoring/Details', [
            'pageant' => $pageant,
            'roundCriterias' => $roundCriterias,
        ]);
    }

    public function show(Pageant $pageant)
    {
        $judge = Auth::user();

        $alreadyScores = $judge->candidateCritieras->whereIn('criteria_id', $pageant->criterias->where('round', $pageant->current_round)->pluck('id'));

        if ($alreadyScores->count() > 0) {
            session()->flash('message', 'Already scored');
            return;
        }

        if ($pageant->current_round == null) {
            session()->flash('message', 'Round not yet started');
            return;
        }

        return Inertia::render('Scoring/Show', [
            'pageant' => $pageant->load(['criterias' => function ($query) use ($pageant) {
                $query->where('round', $pageant->current_round);
            }, 'candidates', 'judges']),
        ]);
    }

    public function score(Pageant $pageant, Criteria $criteria)
    {

        $judge = Auth::user();

        if ($pageant->current_round != $criteria->round) {
            session()->flash('message', 'Round not yet started');
            return;
        }

        if ($pageant->current_round == null) {
            session()->flash('message', 'Pageant not opened yet');
            return;
        }

        $alreadyScores = $judge->candidateCritieras->where('criteria_id', $criteria->id);

        if ($alreadyScores->count() > 0) {
            session()->flash('message', 'Already scored');
            return;
        }

        return Inertia::render('Scoring/Show', [
            'pageant' => $pageant->load(['criterias' => function ($query) use ($pageant) {
                $query->where('round', $pageant->current_round);
            }, 'candidates', 'judges']),
        ]);
    }

    public function store(Request $request, Pageant $pageant)
    {
        $request->validate([
            'scores' => ['required', 'array'],
            'scores.*.score' => ['required', 'numeric', 'min:0', 'max:100'], // Add score range validation
            'scores.*.criteria_id' => ['required', 'exists:criterias,id'],
            'scores.*.candidate_id' => ['required', 'exists:candidates,id'],
        ]);

        $scoring = $request->scores;
        $judge = Auth::user();

        foreach ($scoring as $scores) {
            // Validate that the criteria belongs to this pageant
            $criteria = Criteria::where('id', $scores['criteria_id'])
                ->where('pageant_id', $pageant->id)
                ->where('round', $pageant->current_round)
                ->first();

            if (!$criteria) {
                return back()->withErrors(['error' => 'Invalid criteria for this pageant round.']);
            }

            // Validate that the candidate belongs to this pageant
            $candidate = $pageant->candidates()->where('id', $scores['candidate_id'])->first();
            
            if (!$candidate) {
                return back()->withErrors(['error' => 'Invalid candidate for this pageant.']);
            }

            // Check if judge already scored this candidate-criteria combination
            $existingScore = CandidateCriteria::where([
                'criteria_id' => $scores['criteria_id'],
                'candidate_id' => $scores['candidate_id'],
                'user_id' => $judge->id
            ])->first();

            if ($existingScore) {
                return back()->withErrors(['error' => 'You have already scored this candidate for this criteria.']);
            }

            // Store the score
            CandidateCriteria::create([
                'criteria_id' => $scores['criteria_id'],
                'candidate_id' => $scores['candidate_id'],
                'user_id' => $judge->id,
                'score' => $scores['score']
            ]);
        }

        return redirect()->route('scoring.index')->with('success', 'Scores submitted successfully.');
    }

    public function viewScores(Request $request, Pageant $pageant)
    {
        $candidates = $pageant->candidates;
        $criterias = $pageant->criterias->where('round', $pageant->current_round)->values()->all();
        $judges = $pageant->judges;

        if ($pageant->separate_scoring) {
            // Separate scoring: calculate scores for each round separately
            return $this->viewSeparateScores($pageant, $candidates, $criterias);
        }

        // Combined scoring: calculate cumulative scores across all rounds
        return $this->viewCombinedScores($pageant, $candidates, $criterias);
    }

    private function viewSeparateScores($pageant, $candidates, $criterias)
    {
        $candidatesScores = $candidates->map(function ($candidate) use ($criterias, $pageant) {
            $scores = [];
            $criteriaDetails = [];
            
            foreach ($criterias as $criteria) {
                $totalScore = CandidateCriteria::where('candidate_id', $candidate->id)
                    ->where('criteria_id', $criteria->id)
                    ->sum('score');
                
                $judgeCount = CandidateCriteria::where('candidate_id', $candidate->id)
                    ->where('criteria_id', $criteria->id)
                    ->count();
                
                $scores[$criteria->id] = $totalScore ?? 0;
                $criteriaDetails[$criteria->id] = [
                    'total' => $totalScore ?? 0,
                    'average' => $judgeCount > 0 ? ($totalScore / $judgeCount) : 0,
                    'judge_count' => $judgeCount
                ];
            }

            $total = array_sum($scores);
            $averageScore = count($scores) > 0 ? ($total / count($scores)) : 0;
            
            $candidate['scores'] = $scores;
            $candidate['criteria_details'] = $criteriaDetails;
            $candidate['total'] = $total;
            $candidate['average_score'] = round($averageScore, 2);
            $candidate['round'] = $pageant->current_round;

            return $candidate;
        });

        return $this->formatResults($pageant, $candidatesScores, $criterias);
    }

    private function viewCombinedScores($pageant, $candidates, $criterias)
    {
        // Get all criterias up to current round for combined scoring
        $allCriterias = $pageant->criterias->where('round', '<=', $pageant->current_round);
        
        $candidatesScores = $candidates->map(function ($candidate) use ($allCriterias) {
            $scores = [];
            $criteriaDetails = [];
            
            foreach ($allCriterias as $criteria) {
                $totalScore = CandidateCriteria::where('candidate_id', $candidate->id)
                    ->where('criteria_id', $criteria->id)
                    ->sum('score');
                
                $judgeCount = CandidateCriteria::where('candidate_id', $candidate->id)
                    ->where('criteria_id', $criteria->id)
                    ->count();
                
                $scores[$criteria->id] = $totalScore ?? 0;
                $criteriaDetails[$criteria->id] = [
                    'total' => $totalScore ?? 0,
                    'average' => $judgeCount > 0 ? ($totalScore / $judgeCount) : 0,
                    'judge_count' => $judgeCount,
                    'round' => $criteria->round
                ];
            }

            $total = array_sum($scores);
            $averageScore = count($scores) > 0 ? ($total / count($scores)) : 0;
            
            $candidate['scores'] = $scores;
            $candidate['criteria_details'] = $criteriaDetails;
            $candidate['total'] = $total;
            $candidate['average_score'] = round($averageScore, 2);

            return $candidate;
        });

        return $this->formatResults($pageant, $candidatesScores, $criterias, $allCriterias);
    }

    private function formatResults($pageant, $candidatesScores, $criterias, $allCriterias = null)
    {
        // Add ranking with tie-breaking
        $maleCandidates = $candidatesScores->where('gender', 'mr')
            ->sortByDesc(function ($candidate) {
                return [$candidate['total'], $candidate['average_score']];
            })
            ->values()
            ->map(function ($candidate, $index) {
                $candidate['rank'] = $index + 1;
                return $candidate;
            })
            ->all();

        $femaleCandidates = $candidatesScores->where('gender', 'ms')
            ->sortByDesc(function ($candidate) {
                return [$candidate['total'], $candidate['average_score']];
            })
            ->values()
            ->map(function ($candidate, $index) {
                $candidate['rank'] = $index + 1;
                return $candidate;
            })
            ->all();

        return Inertia::render('Pageant/PageantScores', [
            'pageant' => $pageant,
            'maleCandidates' => $maleCandidates,
            'femaleCandidates' => $femaleCandidates,
            'criterias' => $criterias,
            'allCriterias' => $allCriterias ?? $criterias,
            'separateScoring' => $pageant->separate_scoring,
        ]);
    }

    public function forPrinting(Pageant $pageant)
    {

        $candidates = $pageant->candidates;
        $criterias = $pageant->criterias;
        $judges = $pageant->judges;

        $candidatesScores = $candidates->map(function ($candidate) use ($criterias, $judges) {
            $scores = [];

            foreach ($criterias as $criteria) {
                foreach ($judges as $judge) {
                    // $pivot = $criteria->candidates()->where('candidates.id', $candidate->id)->wherePivot('user_id', $judge->id)->get()->sum('pivot.score');
                    $pivot = CandidateCriteria::where(function ($query) use ($candidate, $judge, $criteria) {
                        $query->where('criteria_id', $criteria->id)->where('candidate_id', $candidate->id)->where('user_id', $judge->id);
                    })->sum('score');
                    $scores[$criteria->id][$judge->id] = $pivot ?? '';
                }
                $scores[$criteria->id]['total'] = array_sum($scores[$criteria->id]);
            }

            $total = array_sum(array_column($scores, 'total'));

            $candidate['scores'] = $scores;
            $candidate['total'] = $total;

            return $candidate;
        });

        // dd($candidatesScores->toArray());

        $maleCandidates = $candidatesScores->where('gender', 'mr')->sortByDesc('total')->values()->all();
        $femaleCandidates = $candidatesScores->where('gender', 'ms')->sortByDesc('total')->values()->all();

        return Inertia::render('Pageant/PageantPrinting', [
            'pageant' => $pageant,
            'maleCandidates' => $maleCandidates,
            'femaleCandidates' => $femaleCandidates,
            'criterias' => $criterias->values()->all(),
            'judges' => $judges,
        ]);
    }
}
