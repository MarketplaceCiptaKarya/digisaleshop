import Quill, { Delta, EmitterSource, Range } from 'quill';
import 'quill/dist/quill.snow.css';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

interface EditorProps {
    readOnly?: boolean;
    defaultValue?: Delta;
    onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
    onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
    placeholder?: string;
    onChangeResult?: (html: string) => void;
    defaultHtmlValue?: string;
}

const css = `
.ql-editor {
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
}
.ql-formats {
    border: 1px solid var(--border);
    margin: 2px;
}
.ql-toolbar {
    border: 1px solid var(--border);
    border-radius: 4px 4px 0 0;
}
.ql-container {
    border: 1px solid var(--border);
    border-radius: 0 0 4px 4px;
    background-color: var(--popover);
}
.ql-tooltip {
    left: 0 !important;
    top: 0 !important;
}
`;

const RichTextEditor = forwardRef<Quill | null, EditorProps>(
    ({ readOnly = false, defaultValue, onTextChange, onSelectionChange, placeholder, onChangeResult, defaultHtmlValue }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);
        const quillInstanceRef = useRef<Quill | null>(null);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useImperativeHandle(ref, () => quillInstanceRef.current!, [quillInstanceRef.current]);

        useEffect(() => {
            if (quillInstanceRef.current) {
                quillInstanceRef.current.enable(!readOnly);
            }
        }, [readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const editorContainer = container.ownerDocument.createElement('div');
            container.appendChild(editorContainer);

            const quill = new Quill(editorContainer, {
                modules: {
                    toolbar: [
                        [{ header: ['1', '2', '3', '4', '5', '6'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ align: [] }],
                        [{ color: [] }, { background: [] }],
                        [{ script: 'sub' }, { script: 'super' }],
                        ['blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                        [{ font: [] }],
                        [{ size: [] }],
                        [{ direction: 'rtl' }],
                        ['link', 'image', 'video'],
                        ['clean'],
                    ],
                },
                theme: 'snow',
                placeholder: placeholder || '',
            });

            quillInstanceRef.current = quill;

            if (defaultValueRef.current) {
                quill.setContents(defaultValueRef.current);
            }

            if (defaultHtmlValue) {
                quill.clipboard.dangerouslyPasteHTML(defaultHtmlValue);
            }

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
                onChangeResult?.(quill.root.innerHTML);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            return () => {
                quillInstanceRef.current = null;
                container.innerHTML = '';
            };
        }, []);

        return (
            <>
                <style>{css}</style>
                <div className="shadow" ref={containerRef} />
            </>
        );
    },
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
