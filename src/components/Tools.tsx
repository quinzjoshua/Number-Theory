import React, { useState } from 'react';
import { Calculator, Hash, Binary, Layers, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Tools() {
  const [activeTool, setActiveTool] = useState<'primes' | 'gcd' | 'modular' | 'sieve'>('primes');

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Interactive Playground</h2>
        <p className="text-zinc-600">Explore number theory concepts with these live tools.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'primes', name: 'Prime Factors', icon: Hash },
            { id: 'gcd', name: 'GCD & LCM', icon: Calculator },
            { id: 'modular', name: 'Modular Exp', icon: Binary },
            { id: 'sieve', name: 'Sieve of Eratosthenes', icon: Layers },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl transition-all border",
                activeTool === tool.id 
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" 
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              )}
            >
              <div className="flex items-center gap-3">
                <tool.icon className="w-5 h-5" />
                <span className="font-medium">{tool.name}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", activeTool === tool.id && "rotate-90")} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 shadow-xl p-8 min-h-[500px]">
          {activeTool === 'primes' && <PrimeFactorTool />}
          {activeTool === 'gcd' && <GCDTool />}
          {activeTool === 'modular' && <ModularTool />}
          {activeTool === 'sieve' && <SieveTool />}
        </div>
      </div>
    </div>
  );
}

function PrimeFactorTool() {
  const [number, setNumber] = useState<string>('120');
  const [factors, setFactors] = useState<number[]>([]);

  const calculate = () => {
    let n = parseInt(number);
    if (isNaN(n) || n < 2) return;
    const res: number[] = [];
    let d = 2;
    while (n >= d * d) {
      if (n % d === 0) {
        res.push(d);
        n /= d;
      } else {
        d++;
      }
    }
    res.push(n);
    setFactors(res);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Prime Factorization</h3>
        <p className="text-zinc-500">Every integer greater than 1 is either a prime number or can be represented as a product of prime numbers.</p>
      </div>
      <div className="flex gap-4">
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none"
          placeholder="Enter a number..."
        />
        <button onClick={calculate} className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
          Factorize
        </button>
      </div>
      {factors.length > 0 && (
        <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
          <div className="text-sm font-bold text-zinc-400 uppercase mb-4">Result</div>
          <div className="flex flex-wrap items-center gap-3 text-3xl font-mono">
            {factors.map((f, i) => (
              <React.Fragment key={i}>
                <span className="bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm text-zinc-900">{f}</span>
                {i < factors.length - 1 && <span className="text-zinc-300">×</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-6 text-zinc-600">
            {number} = {factors.join(' × ')}
          </p>
        </div>
      )}
    </div>
  );
}

function GCDTool() {
  const [a, setA] = useState('48');
  const [b, setB] = useState('18');
  const [result, setResult] = useState<{ gcd: number, lcm: number } | null>(null);

  const calculate = () => {
    const numA = Math.abs(parseInt(a));
    const numB = Math.abs(parseInt(b));
    if (isNaN(numA) || isNaN(numB)) return;

    const getGcd = (x: number, y: number): number => (!y ? x : getGcd(y, x % y));
    const gcd = getGcd(numA, numB);
    const lcm = (numA * numB) / gcd;
    setResult({ gcd, lcm });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">GCD & LCM Calculator</h3>
        <p className="text-zinc-500">Find the Greatest Common Divisor and Least Common Multiple of two numbers.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none"
          placeholder="Number A"
        />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none"
          placeholder="Number B"
        />
      </div>
      <button onClick={calculate} className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
        Calculate
      </button>
      {result && (
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="text-xs font-bold text-emerald-600 uppercase mb-2">GCD</div>
            <div className="text-4xl font-mono font-bold text-emerald-900">{result.gcd}</div>
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-xs font-bold text-blue-600 uppercase mb-2">LCM</div>
            <div className="text-4xl font-mono font-bold text-blue-900">{result.lcm}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModularTool() {
  const [base, setBase] = useState('2');
  const [exp, setExp] = useState('10');
  const [mod, setMod] = useState('7');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    let b = BigInt(base);
    let e = BigInt(exp);
    let m = BigInt(mod);
    if (m === 0n) return;
    
    let res = 1n;
    b = b % m;
    while (e > 0n) {
      if (e % 2n === 1n) res = (res * b) % m;
      e = e / 2n;
      b = (b * b) % m;
    }
    setResult(Number(res));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Modular Exponentiation</h3>
        <p className="text-zinc-500">Calculate (base ^ exponent) mod modulus efficiently using binary exponentiation.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase">Base</label>
          <input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase">Exponent</label>
          <input type="number" value={exp} onChange={(e) => setExp(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase">Modulus</label>
          <input type="number" value={mod} onChange={(e) => setMod(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
        Compute
      </button>
      {result !== null && (
        <div className="p-8 bg-zinc-900 text-white rounded-2xl text-center">
          <div className="text-sm text-zinc-400 mb-2">{base}<sup>{exp}</sup> mod {mod} =</div>
          <div className="text-6xl font-mono font-bold">{result}</div>
        </div>
      )}
    </div>
  );
}

function SieveTool() {
  const [limit, setLimit] = useState(100);
  const [primes, setPrimes] = useState<boolean[]>([]);

  const runSieve = () => {
    const arr = new Array(limit + 1).fill(true);
    arr[0] = arr[1] = false;
    for (let p = 2; p * p <= limit; p++) {
      if (arr[p]) {
        for (let i = p * p; i <= limit; i += p)
          arr[i] = false;
      }
    }
    setPrimes(arr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Sieve of Eratosthenes</h3>
        <p className="text-zinc-500">An ancient algorithm for finding all prime numbers up to any given limit.</p>
      </div>
      <div className="flex gap-4">
        <input
          type="range"
          min="10"
          max="200"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="flex-1 accent-zinc-900"
        />
        <span className="font-mono font-bold w-12">{limit}</span>
        <button onClick={runSieve} className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
          Run
        </button>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {primes.length > 0 ? primes.slice(1).map((isPrime, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square flex items-center justify-center rounded-md text-xs font-bold transition-all duration-500",
              isPrime ? "bg-emerald-500 text-white scale-110 shadow-md" : "bg-zinc-100 text-zinc-400"
            )}
          >
            {i + 1}
          </div>
        )) : (
          <div className="col-span-10 py-20 text-center text-zinc-400 italic">
            Click "Run" to visualize the sieve.
          </div>
        )}
      </div>
    </div>
  );
}
