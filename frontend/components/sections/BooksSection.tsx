import booksData from "@/data/books.json";
import type { Book } from "@/types/books";
import BookCard from "@/components/cards/BookCard";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

const books = booksData as Book[];

const BooksSection = () => {
  return (
    <section
      id="libros"
      className="relative isolate w-full scroll-mt-24 bg-[url('/bookSectionbg.jpg')] bg-cover bg-center px-6 py-16 md:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/70"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-white">Libros</h2>
        {books.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-white/70">{MISSING_CONTENT_LABEL}</p>
        )}
      </div>
    </section>
  );
};

export default BooksSection;
