'use client';

import { LucideIcon, Calendar } from 'lucide-react';

interface TimeSliderProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    labels: string[];
}

export default function TimeSlider({ value, min, max, onChange, labels }: TimeSliderProps) {
    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Historical Timeline</h3>
            </div>

            <div className="relative pt-6 px-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />

                <div className="flex justify-between mt-4">
                    {labels.map((label, index) => (
                        <div
                            key={index}
                            className={`text-xs font-medium transition-all duration-200 ${index === value ? 'text-green-600 scale-110 font-bold' : 'text-gray-400'
                                }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
