import PrimaryButton from "@/Components/PrimaryButton";
import TableComponent from "@/Components/TableComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Fragment } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ScoringIndex({ auth, pageant, roundCriterias }) {
    const { flash } = usePage().props;

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 ">
                            {flash.message && (
                                <div className="block w-full p-2 rounded-sm bg-green-500 text-white mb-2">
                                    {flash.message}
                                </div>
                            )}
                            
                            {/* Current Round Indicator */}
                            <div className="mb-6">
                                <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                <span className="font-medium">Current Round: </span>
                                                {pageant.current_round ? `Round ${pageant.current_round}` : 'Not Started'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {roundCriterias.map((roundGroup, index) => {
                                // Get the round number from the first criteria in the group
                                const roundNumber = roundGroup.length > 0 ? roundGroup[0].round : index + 1;
                                const isCurrentRound = pageant.current_round == roundNumber;
                                const isCompletedRound = pageant.current_round > roundNumber;
                                
                                return (
                                    <div key={index} className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="uppercase dark:text-white text-2xl font-bold flex items-center">
                                                {`Round ${roundNumber}`}
                                                {isCurrentRound && (
                                                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                                {isCompletedRound && (
                                                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Completed
                                                    </span>
                                                )}
                                                {!isCurrentRound && !isCompletedRound && (
                                                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Upcoming
                                                    </span>
                                                )}
                                            </h2>
                                            <div className="text-sm dark:text-gray-300">
                                                {roundGroup.length} criteria
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {roundGroup.map((criteria) => {
                                                return (
                                                    <Link
                                                        key={criteria.id}
                                                        href={route(
                                                            "scoring.score",
                                                            {
                                                                pageant: pageant.id,
                                                                criteria: criteria.id,
                                                            }
                                                        )}
                                                        className={classNames(
                                                            `block w-full object-cover bg-black rounded-lg overflow-hidden transition-all duration-200 hover:scale-105`,
                                                            isCurrentRound
                                                                ? "border-2 border-green-500 shadow-lg"
                                                                : isCompletedRound
                                                                ? "border-2 border-gray-400 opacity-75"
                                                                : "border-2 border-yellow-400 opacity-60"
                                                        )}
                                                    >
                                                        <div className="relative">
                                                            <LazyLoadImage
                                                                src={
                                                                    pageant.background 
                                                                        ? `/storage/${pageant.background}`
                                                                        : "/logo.png"
                                                                }
                                                                placeholderSrc="/logo.png"
                                                                alt={criteria.name}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                                                                <div className="w-full py-3 px-4 bg-gradient-to-t from-black to-transparent">
                                                                    <h3 className="text-white font-bold text-center uppercase text-sm">
                                                                        {criteria.name}
                                                                    </h3>
                                                                    {criteria.description && (
                                                                        <p className="text-gray-300 text-xs text-center mt-1">
                                                                            {criteria.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Status indicator */}
                                                            <div className="absolute top-2 right-2">
                                                                {isCurrentRound && (
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                                )}
                                                                {isCompletedRound && (
                                                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                                )}
                                                                {!isCurrentRound && !isCompletedRound && (
                                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {roundCriterias.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.21 0 7.813 2.602 9.288 6.286" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No criteria available</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            No criteria have been set up for this pageant yet.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
