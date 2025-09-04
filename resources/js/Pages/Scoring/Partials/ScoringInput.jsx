import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useState } from "react";

function ScoringInput({ criteria, candidate, onInputData = () => {} }) {
    const [value, setValue] = useState(0);
    const [focused, setFocused] = useState(false);
    const minMax = { min: 0, max: criteria.percentage };

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <label 
                    htmlFor={`can${candidate.id}crit${criteria.id}`}
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide"
                >
                    {criteria.name}
                </label>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    Max: {criteria.percentage}
                </span>
            </div>
            <div className="w-full">
                <TextInput
                    id={`can${candidate.id}crit${criteria.id}`}
                    type="number"
                    name="scores[]"
                    className={`w-full text-center text-sm font-semibold py-2 transition-all duration-200 ${
                        focused 
                            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } ${
                        value > minMax.max 
                            ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-200 dark:ring-red-800' 
                            : ''
                    } hover:border-blue-400 dark:hover:border-blue-500`}
                    value={value}
                    min={minMax.min}
                    max={minMax.max}
                    step="0.1"
                    placeholder="0.0"
                    data-criteria-id={criteria.id}
                    required
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        const inputValue = parseFloat(e.target.value) || 0;
                        const score = Math.max(
                            minMax.min,
                            Math.min(minMax.max, inputValue)
                        );

                        setValue(inputValue);
                        onInputData(candidate.id, criteria.id, score);
                    }}
                />
                
                {/* Error message for scores exceeding maximum */}
                {value > minMax.max && (
                    <div className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Exceeds max {minMax.max}
                    </div>
                )}
                
                {/* Score range indicator */}
                <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Min: {minMax.min}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{value}</span>
                    <span>Max: {minMax.max}</span>
                </div>
            </div>
        </div>
    );
}

export default ScoringInput;
