'use client';

import { useUserPoints } from '../context/context';

export default function Scoreboard() {
    const { points, name } = useUserPoints();

    return (
        <div className="absolute bottom-2 left-2 pointer-events-none p-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-md shadow-md z-50 font-mono">
            <h1 className="text-sm font-bold text-center">MingaCoins</h1>
            <div className="flex items-center justify-center">
                <p className="text-2xl font-bold">{points}</p>
            </div>
        </div>
    );
}
