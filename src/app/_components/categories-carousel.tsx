"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminEditCategory } from "./admin-edit-category";
import { AdminDeleteCategory } from "./admin-delete-category";

import { getCategoryIcon } from "@/lib/category-icons";

type Category = {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
};

interface CategoriesCarouselProps {
  categories: Category[];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const maxIndex = Math.max(0, categories.length - visibleCount);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  // Calcula quantos itens cabem baseado na largura do container
  const updateVisibleCount = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (width < 480) {
      setVisibleCount(2);
    } else if (width < 640) {
      setVisibleCount(3);
    } else {
      setVisibleCount(4);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  // Garante que o índice não ultrapasse o máximo ao redimensionar
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const scrollLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Se arrastou mais de 60px, muda o slide
    if (dragOffset > 60 && canScrollLeft) {
      scrollLeft();
    } else if (dragOffset < -60 && canScrollRight) {
      scrollRight();
    }
    setDragOffset(0);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  if (categories.length === 0) {
    return (
      <div className="flex justify-center py-6">
        <span className="text-sm text-muted-foreground">
          Nenhuma categoria cadastrada.
        </span>
      </div>
    );
  }

  // Calcula a largura de cada item como porcentagem
  const itemWidthPercent = 100 / visibleCount;
  const gapPx = 24; // gap entre itens
  const translateX =
    -(currentIndex * itemWidthPercent) +
    (isDragging ? (dragOffset / (containerRef.current?.clientWidth || 1)) * 100 : 0);

  return (
    <div className="relative">
      {/* Seta esquerda */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-white shadow-lg transition-colors hover:bg-gray-100 sm:left-1 lg:left-4"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Container do carrossel */}
      <div
        ref={containerRef}
        className={[
          "overflow-hidden py-1",
          canScrollLeft ? "pl-11 sm:pl-12 lg:pl-14" : "pl-0.5",
          canScrollRight ? "pr-11 sm:pr-12 lg:pr-14" : "pr-1",
        ].join(" ")}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? "none" : "transform 0.4s ease",
            gap: `${gapPx}px`,
          }}
        >
          {categories.map((category) => {
            const icon = getCategoryIcon(category.name, category.iconUrl);

            return (
              <div
                key={category.id}
                className="box-border flex flex-shrink-0 flex-col gap-2 px-0.5"
                style={{
                  width: `calc(${itemWidthPercent}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`,
                }}
              >
                <Link
                  href={`/professionalList?category=${category.id}`}
                  className="box-border flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-3 text-center text-[10px] transition-colors hover:border-violet-800 sm:h-28 sm:p-4 sm:text-xs md:h-32 md:text-sm lg:h-[100px]"
                  draggable={false}
                  onClick={(e) => {
                    if (Math.abs(dragOffset) > 5) e.preventDefault();
                  }}
                >
                  {icon ? (
                    <Image
                      src={icon}
                      alt={`Ícone ${category.name}`}
                      width={40}
                      height={40}
                      className="mx-auto h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                      draggable={false}
                    />
                  ) : (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 sm:h-9 sm:w-9 md:h-10 md:w-10">
                      <span className="text-base font-bold sm:text-lg">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="mt-2">{category.name}</p>
                </Link>
                <div className="flex gap-2">
                  <AdminEditCategory category={category} />
                  <AdminDeleteCategory
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seta direita */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-white shadow-lg transition-colors hover:bg-gray-100 sm:right-1 lg:right-4"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
