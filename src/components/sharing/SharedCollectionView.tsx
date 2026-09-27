import { useState } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  Leaf,
} from "lucide-react";

import {
  Button,
  Surface,
} from "@/components/ui";

import type {
  SharedCollection,
  SharedSpecimen,
} from "@/sharing/types";

import { SharedSpecimenCard } from "./SharedSpecimenCard";
import { SharedSpecimenView } from "./SharedSpecimenView";

interface SharedCollectionViewProps {
  collection: SharedCollection;
}

function formatSharedDate(
  value: string,
): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

export function SharedCollectionView({
  collection,
}: SharedCollectionViewProps) {
  const shouldReduceMotion = useReducedMotion();

  const [
    selectedSpecimen,
    setSelectedSpecimen,
  ] = useState<SharedSpecimen | null>(null);

  const sharedDate = formatSharedDate(
    collection.sharedAt,
  );

  function handleOpenSpecimen(
    specimen: SharedSpecimen,
  ) {
    setSelectedSpecimen(specimen);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion
          ? "auto"
          : "smooth",
      });
    });
  }

  function handleReturnToCollection() {
    const previousSpecimen =
      selectedSpecimen;

    setSelectedSpecimen(null);

    if (!previousSpecimen) {
      return;
    }

    window.requestAnimationFrame(() => {
      document
        .getElementById(
          `shared-specimen-${previousSpecimen.id}-open`,
        )
        ?.focus();
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AnimatePresence
        initial={false}
        mode="wait"
      >
        {selectedSpecimen ? (
          <motion.div
            key={`shared-specimen-${selectedSpecimen.id}`}
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    y: 6,
                  }
            }
            transition={{
              duration: shouldReduceMotion
                ? 0.1
                : 0.22,
              ease: "easeOut",
            }}
          >
            <header className="mb-8">
              <Button
                type="button"
                variant="secondary"
                leadingIcon={
                  <ArrowLeft
                    size={16}
                    aria-hidden="true"
                  />
                }
                onClick={
                  handleReturnToCollection
                }
              >
                Back to shared collection
              </Button>
            </header>

            <SharedSpecimenView
              specimen={selectedSpecimen}
            />
          </motion.div>
        ) : (
          <motion.div
            key="shared-collection"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -6,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    y: -6,
                  }
            }
            transition={{
              duration: shouldReduceMotion
                ? 0.1
                : 0.22,
              ease: "easeOut",
            }}
          >
            <header className="border-b border-[var(--color-border)] pb-8 sm:pb-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Leaf
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.75}
                  />

                  <p className="metadata-label">
                    Shared botanical archive
                  </p>
                </div>

                <h1 className="mt-4 font-display type-display text-[var(--color-text-primary)]">
                  {collection.title ??
                    "Botanical Collection"}
                </h1>

                {collection.description ? (
                  <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg sm:leading-8">
                    {collection.description}
                  </p>
                ) : (
                  <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                    A read-only botanical record
                    shared through Verdantry.
                  </p>
                )}
              </div>

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-[var(--color-border)] pt-6">
                <div>
                  <dt className="metadata-label">
                    Specimens
                  </dt>

                  <dd className="mt-1.5 font-display type-title text-[var(--color-text-primary)]">
                    {collection.specimens.length}
                  </dd>
                </div>

                {sharedDate ? (
                  <div>
                    <dt className="metadata-label">
                      Shared
                    </dt>

                    <dd className="mt-1.5 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {sharedDate}
                    </dd>
                  </div>
                ) : null}

                <div>
                  <dt className="metadata-label">
                    Access
                  </dt>

                  <dd className="mt-1.5 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Read-only
                  </dd>
                </div>
              </dl>
            </header>

            {collection.specimens.length > 0 ? (
              <section
                aria-labelledby="shared-collection-specimens-heading"
                className="pt-8 sm:pt-10"
              >
                <div className="mb-6 flex items-end justify-between gap-6">
                  <div>
                    <p className="metadata-label">
                      Botanical records
                    </p>

                    <h2
                      id="shared-collection-specimens-heading"
                      className="mt-2 font-display type-title text-[var(--color-text-primary)]"
                    >
                      Specimen collection
                    </h2>
                  </div>

                  <p className="hidden max-w-sm text-right text-xs leading-5 text-[var(--color-text-muted)] sm:block">
                    Select a specimen to open
                    its public botanical record.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {collection.specimens.map(
                    (specimen) => (
                      <SharedSpecimenCard
                        key={specimen.id}
                        specimen={specimen}
                        onOpen={
                          handleOpenSpecimen
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            ) : (
              <Surface
                variant="subtle"
                className="mt-8 p-8 sm:p-10"
              >
                <section
                  aria-labelledby="shared-collection-empty-heading"
                  className="max-w-xl"
                >
                  <p className="metadata-label">
                    Botanical records
                  </p>

                  <h2
                    id="shared-collection-empty-heading"
                    className="mt-3 font-display type-title text-[var(--color-text-primary)]"
                  >
                    This archive is awaiting its
                    first public specimen
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    The collection is being
                    shared, but no botanical
                    specimens are currently
                    available in its public
                    record.
                  </p>
                </section>
              </Surface>
            )}

            <Surface className="mt-12 p-8 sm:mt-16 sm:p-10">
              <section
                aria-labelledby="shared-collection-cta-heading"
                className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="max-w-xl">
                  <p className="metadata-label">
                    Private by design
                  </p>

                  <h2
                    id="shared-collection-cta-heading"
                    className="mt-3 font-display type-title text-[var(--color-text-primary)]"
                  >
                    Begin your own botanical
                    archive
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Verdantry is free to use.
                    Catalog your own collection,
                    with its own private
                    records, care history, and
                    sharing controls.
                  </p>
                </div>

                <a
                  href="/"
                  className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border border-transparent bg-[var(--color-botanical)] px-[1.125rem] text-sm font-medium leading-none tracking-[0.005em] text-[var(--color-text-on-botanical)] shadow-[var(--shadow-control)] transition-[background-color,box-shadow,transform] duration-[160ms] ease-[var(--ease-standard)] hover:bg-[var(--color-botanical-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:translate-y-[0.5px] active:scale-[0.985]"
                >
                  Begin your archive
                </a>
              </section>
            </Surface>

            <footer className="mt-8 border-t border-[var(--color-border)] pt-6">
              <p className="max-w-2xl text-xs leading-5 text-[var(--color-text-muted)]">
                This shared view contains only
                selected botanical information.
                Private notes, specimen
                locations, acquisition details,
                reminders, and care records are
                not included.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}