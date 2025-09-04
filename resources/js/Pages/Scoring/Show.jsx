import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import CandidateBox from "@/Pages/Scoring/Partials/CandidateBox";
import PrimaryButton from "@/Components/PrimaryButton";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ScoringShow({ auth, pageant }) {
    const { data, setData, post } = useForm({
        scores: [],
    });

    const candidates = pageant.candidates;
    const femaleCandidates = candidates.filter(
        (candidate) => candidate.gender == "ms"
    );
    const maleCandidates = candidates.filter(
        (candidate) => candidate.gender == "mr"
    );

    const handleSetData = (candidate_id, criteria_id, score) => {
        const scoring = {
            candidate_id: candidate_id,
            criteria_id: criteria_id,
            score: score,
        };
        const found = data.scores.find(
            (obj) =>
                obj.candidate_id === candidate_id &&
                obj.criteria_id === criteria_id
        );

        if (!found) {
            console.log("Not Found. Adding...");
            setData("scores", [...data.scores, scoring]);
        } else {
            console.log("Found. Adding...");
            const objIndex = data.scores.findIndex(
                (obj) =>
                    obj.candidate_id === candidate_id &&
                    obj.criteria_id === criteria_id
            );
            data.scores[objIndex] = scoring;
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("scoring.store", pageant.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {pageant.pageant}
                </h2>
            }
        >
            <Head title="Pageant" />

            <div
                className="py-12 bg-fixed bg-cover min-h-screen"
                style={{
                    backgroundImage: `url(/storage/${pageant.background})`,
                }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 dark:text-white">
                            <form onSubmit={submit}>
                                <div className="flex justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-200 dark:border-gray-600">
                                    <div className="space-y-2">
                                        <div className="uppercase text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                Round: {pageant.current_round}
                                            </span>
                                        </div>
                                        <div className="uppercase text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                Type: {pageant.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <PrimaryButton className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                            Save Scores
                                        </PrimaryButton>
                                    </div>
                                </div>
                                
                                {/* Mr Candidates Section */}
                                {(pageant.type == "mr" ||
                                    pageant.type == "mr&ms") && (
                                    <div className="mb-8">
                                        <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                                            <h2 className="uppercase font-bold text-xl tracking-wide text-blue-800 dark:text-blue-200">
                                                Mr Candidates
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
                                            {maleCandidates.map((candidate) => {
                                                return (
                                                    <CandidateBox
                                                        key={candidate.id}
                                                        candidate={candidate}
                                                        criterias={
                                                            pageant.criterias
                                                        }
                                                        onInputData={
                                                            handleSetData
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {pageant.type == "mr&ms" && (
                                    <div className="my-8">
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                                    </div>
                                )}

                                {/* Ms Candidates Section */}
                                {(pageant.type == "ms" ||
                                    pageant.type == "mr&ms") && (
                                    <div className="mb-8">
                                        <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900 dark:to-pink-800 rounded-lg">
                                            <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                                            <h2 className="uppercase font-bold text-xl tracking-wide text-pink-800 dark:text-pink-200">
                                                Ms Candidates
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
                                            {femaleCandidates.map(
                                                (candidate) => {
                                                    return (
                                                        <CandidateBox
                                                            key={candidate.id}
                                                            candidate={
                                                                candidate
                                                            }
                                                            criterias={
                                                                pageant.criterias
                                                            }
                                                            onInputData={
                                                                handleSetData
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
