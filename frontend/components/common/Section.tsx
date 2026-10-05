export default function Section({children}: {children: React.ReactNode}) {
    return (
        <section className="mx-auto h-screen">
            {children}
        </section>
    );
}