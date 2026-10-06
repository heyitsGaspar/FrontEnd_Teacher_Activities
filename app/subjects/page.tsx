const subjects = [
    {
        name: 'Matemáticas',
        description: 'Resolución de problemas, conteos y pensamiento lógico para desarrollar habilidades numéricas.',
        color: 'from-blue-500 to-cyan-400',
    },
    {
        name: 'Lenguaje',
        description: 'Lectura, escritura y expresión oral para fortalecer la comunicación y la creatividad.',
        color: 'from-violet-500 to-fuchsia-400',
    },
    {
        name: 'Ciencias',
        description: 'Exploración del entorno, experimentos y curiosidad por comprender el mundo natural.',
        color: 'from-emerald-500 to-green-400',
    },
    {
        name: 'Arte',
        description: 'Creatividad, colores y expresión personal a través de actividades manuales y visuales.',
        color: 'from-pink-500 to-rose-400',
    },
    {
        name: 'Educación Física',
        description: 'Movimiento, coordinación y hábitos saludables para el desarrollo integral del niño.',
        color: 'from-amber-500 to-orange-400',
    },
];

export default function SubjectsPage() {
    return (
        <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                        Aula infantil
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Materias</h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                        Un espacio para organizar y presentar las asignaturas que se trabajan en la jornada escolar.
                    </p>
                </header>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {subjects.map((subject) => (
                        <article
                            key={subject.name}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className={`h-2 bg-linear-to-r ${subject.color}`} />
                            <div className="p-6">
                                <h2 className="mb-3 text-xl font-semibold text-slate-900">{subject.name}</h2>
                                <p className="text-sm leading-6 text-slate-600">{subject.description}</p>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}
