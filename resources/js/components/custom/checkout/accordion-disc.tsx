export const AccordionDisc = ({ checked }: { checked: boolean }) => (
    <span className="relative inline-block size-4 translate-y-[1px] rounded-full border border-muted-foreground bg-background p-0.5">
        <span
            className={`absolute top-1/2 left-1/2 size-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-transform ${
                checked ? 'scale-100' : 'scale-0'
            }`}
        />
    </span>
);
