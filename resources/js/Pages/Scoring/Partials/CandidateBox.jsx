import ScoringInput from "@/Pages/Scoring/Partials/ScoringInput";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function CandidateBox({ candidate, criterias, onInputData = () => {} }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex flex-col">
                <div className="relative w-full group">
                    <div className="aspect-[4/5] overflow-hidden rounded-t-xl">
                        <LazyLoadImage
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src={`/storage/` + candidate.picture}
                            alt={candidate.full_name}
                            placeholderSrc={`/logo.png`}
                            effect="blur"
                        />
                    </div>

                    {/* Candidate Number Badge */}
                    <div className="absolute top-2 left-2 z-10">
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-full px-3 py-1 shadow-lg border border-white/20">
                            <span className="text-sm font-bold tracking-wide">#{candidate.candidate_number}</span>
                        </div>
                    </div>

                    {/* Name Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                        <div className="text-center space-y-1">
                            <div className="text-white font-bold text-sm tracking-wide leading-tight">
                                {candidate.gender.toUpperCase()}. {candidate.full_name.toUpperCase()}
                            </div>
                            <div className="text-gray-200 text-xs font-medium italic">
                                "{candidate.nickname}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scoring Section */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="border-b border-gray-200 dark:border-gray-600 pb-1 mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
                            Score Criteria
                        </h3>
                    </div>
                    {criterias.map((criteria, index) => {
                        return (
                            <ScoringInput
                                key={index}
                                criteria={criteria}
                                candidate={candidate}
                                onInputData={onInputData}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CandidateBox;
