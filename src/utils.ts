const elements: Record<string, HTMLElement | HTMLElement[] | null> = {};

/**
 * document.querySelector with typing and caching
 * @param selector
 * @returns HTMLElement
 */
export function qS<TElement extends HTMLElement = HTMLElement>(selector: string) {
    if (!selector) return new HTMLElement() as TElement;

    if (!elements[selector]) elements[selector] = document.querySelector<TElement>(selector);
    return elements[selector] ? (elements[selector] as TElement) : null;
}

/**
 * document.querySelectorAll with typing, caching, and array return
 * @param selector
 * @returns Array of elements
 */
export function qA<TElement extends HTMLElement = HTMLElement>(
    selector: string,
    parent: HTMLElement | Document = document
) {
    if (!selector) return [new HTMLElement()] as TElement[];

    if (!elements[selector]) elements[selector] = [...parent.querySelectorAll(selector)] as TElement[];
    return elements[selector] as TElement[];
}

export function on<T, E extends Event = Event>(
    selector: string | HTMLElement | Element | Window,
    type: keyof HTMLElementEventMap | T,
    listener: (e: E) => void
) {
    const element = typeof selector === 'string' ? qS(selector) : (selector as HTMLElement);
    if (element) element.addEventListener(type as any, listener as any);
}

export const toggle = (() => {
    const onOff = [
        ['not-playing', 'playing'],
        ['request-new', 'request-change'],
    ] as const;

    return (option: (typeof onOff)[number][number] | HTMLElement, show?: boolean) => {
        if (typeof option !== 'string') {
            show = typeof show === 'boolean' ? show : !option.style.display;
            option.dispatchEvent(new CustomEvent(show ? 'show' : 'hide'));
            option.style.display = show ? '' : 'none';
            return;
        }

        const otherOptions = onOff.find((o) => o?.includes(option as never))?.filter((o) => o !== option);

        const toggledElements = qA(`[data-toggle="${option}"]`);

        show = typeof show === 'boolean' ? show : !toggledElements[0]?.style.display;

        qA(`[data-toggle="${option}"]`).forEach((el) => {
            el.style.display = show ? '' : 'none';
        });

        otherOptions?.forEach((otherOption) => {
            qA(`[data-toggle="${otherOption}"]`).forEach((el) => {
                el.style.display = !show ? '' : 'none';
            });
        });
    };
})();

export function generateSVGs(set: Record<string, string>) {
    Object.entries(set).forEach(([name, svg]) => {
        customElements.define(
            'svg-' + name,
            class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    this.classList.add('svg');
                    this.innerHTML = svg;
                }
            }
        );
    });
}

export class Store {
    static keys = {
        clientKey: 'HEYREED_CLIENT_KEY',
        requestedSong: 'HEYREED_REQUESTED_SONG',
    } as const;

    static set<T = any>(key: keyof typeof this.keys, value: T) {
        localStorage.setItem(this.keys[key], JSON.stringify(value));
    }

    static get<T = any>(key: keyof typeof this.keys): T | null {
        try {
            return JSON.parse(localStorage.getItem(this.keys[key]) || 'null');
        } catch {
            return null;
        }
    }
}
