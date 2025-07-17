// components/custom/infinite-scroll.tsx
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type InfiniteScrollProps<T> = {
    initialData: T[];
    initialCursor: string | null;
    fetchNextPage: (cursor: string) => Promise<{
        data: T[];
        nextCursor: string | null;
    }>;
    renderItem: (item: T, ref: ((node?: Element | null) => void) | undefined) => React.ReactNode;
    emptyMessage?: React.ReactNode;
    loading?: React.ReactNode;
    parent: React.ComponentType<{ children: React.ReactNode }>;
};

export function InfiniteScroll<T>({
    initialData,
    initialCursor,
    fetchNextPage,
    renderItem,
    emptyMessage = <p>No data found</p>,
    loading = <div className="flex justify-center py-4">Loading...</div>,
    parent: Wrapper = ({ children }) => <>{children}</>,
}: InfiniteScrollProps<T>) {
    const [data, setData] = useState<T[]>(initialData);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [isLoading, setIsLoading] = useState(false);
    const { ref, inView } = useInView();

    useEffect(() => {
        setData(initialData);
        setCursor(initialCursor);
    }, [initialData, initialCursor]);

    useEffect(() => {
        if (inView && cursor && !isLoading) {
            setIsLoading(true);
            fetchNextPage(cursor)
                .then(({ data: newData, nextCursor }) => {
                    setData((prev) => [...prev, ...newData]);
                    setCursor(nextCursor);
                })
                .finally(() => setIsLoading(false));
        }
    }, [inView, cursor, isLoading]);

    return (
        <Wrapper>
            {data.length === 0 ? (
                emptyMessage
            ) : (
                <>
                    {data.map((item, index) => renderItem(item, index === data.length - 1 ? ref : undefined))}
                    {isLoading && loading}
                </>
            )}
        </Wrapper>
    );
}
