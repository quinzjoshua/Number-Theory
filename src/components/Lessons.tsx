import React from 'react';
import { BookOpen, Youtube, Lightbulb, GraduationCap } from 'lucide-react';

const LESSONS = [
  {
    title: "Integers",
    description: "The set of whole numbers and their opposites, the building blocks of number theory.",
    icon: BookOpen,
    color: "bg-blue-500",
    video: "https://www.youtube.com/embed/m94WTZP14SA"
  },
  {
    title: "Perfect Numbers",
    description: "Numbers that are equal to the sum of their proper divisors (e.g., 6, 28).",
    icon: Lightbulb,
    color: "bg-amber-500",
    video: "https://www.youtube.com/embed/ff8e4IEr9qI?si=bxx32dcQStJlAnDq"
  },
  {
    title: "Prime Numbers",
    description: "Natural numbers greater than 1 that have no positive divisors other than 1 and itself.",
    icon: GraduationCap,
    color: "bg-emerald-500",
    video: "https://www.youtube.com/embed/UNvwXoTwmvg?si=VbSn2NizDhA-A8IX"
  },
  {
    title: "Mathematical Induction",
    description: "A powerful proof technique used to prove statements for all natural numbers.",
    icon: BookOpen,
    color: "bg-indigo-500",
    video: "https://www.youtube.com/embed/tHNVX3e9zd0?si=zb9YDwY8wgWPmpi2"
  },
  {
    title: "Divisibility",
    description: "The study of when one integer can be divided by another without a remainder.",
    icon: Lightbulb,
    color: "bg-rose-500",
    video: "https://www.youtube.com/embed/8J7Bft3BN0g?si=o59Wz1yZyRTB76FS"
  },
  {
    title: "Euclidean Algorithm",
    description: "An efficient method for computing the greatest common divisor (GCD) of two integers.",
    icon: GraduationCap,
    color: "bg-purple-500",
    video: "https://www.youtube.com/embed/AJn843kplDw"
  },
  {
    title: "Congruences",
    description: "A way of saying two numbers have the same remainder when divided by a modulus.",
    icon: BookOpen,
    color: "bg-orange-500",
    video: "https://www.youtube.com/embed/Eg6CTCu8iio"
  },
  {
    title: "Modular Arithmetic",
    description: "The 'clock arithmetic' system where numbers wrap around upon reaching a certain value.",
    icon: Lightbulb,
    color: "bg-cyan-500",
    video: "https://www.youtube.com/embed/Eg6CTCu8iio?si=am-qD3Iaa_E7me9y"
  },
  {
    title: "Multiplicative Functions",
    description: "Functions where f(mn) = f(m)f(n) for coprime integers m and n.",
    icon: GraduationCap,
    color: "bg-pink-500",
    video: "https://www.youtube.com/embed/4zgJZFcSkn0?si=UV0GNo2oSHPqjiLU"
  }
];

export default function Lessons() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-zinc-900 mb-4">Master the Basics</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">Dive into the core concepts of number theory through curated lessons and visual explanations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LESSONS.map((lesson, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-100 flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-video bg-zinc-900">
                <iframe
                  src={lesson.video}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl text-white ${lesson.color}`}>
                    <lesson.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{lesson.title}</h3>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed flex-1">{lesson.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
