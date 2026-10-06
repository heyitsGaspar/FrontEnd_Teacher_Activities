const students = [
    "Ana",
    "Luis",
    "Sofía",
    "Mateo",
    "Valentina",
];

export default function StudentsPage() {
    
    return (
        <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ marginBottom: "1rem" }}>Alumnos</h1>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {students.map((student) => (
                    <li
                        key={student}
                        style={{
                            padding: "0.5rem 0",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        {student}
                    </li>
                ))}
            </ul>
        </main>
    );
}
