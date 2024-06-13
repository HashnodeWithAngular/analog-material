import {
	Directive,
	ElementRef,
	OnDestroy,
	OnInit,
	Renderer2,
} from "@angular/core";
import { from, fromEvent, Subject, takeUntil, timer } from "rxjs";

@Directive({
	selector: "[clipboardCopyButton]",
	standalone: true,
})
export class ClipboardCopyButtonDirective implements OnInit, OnDestroy {
	unsubscribe = new Subject<void>();

	private readonly MSG_ERROR_COPY: string = "error copying to clipboard";

	constructor(private el: ElementRef, private render2: Renderer2) {}

	ngOnInit(): void {
		const codeBlocks: HTMLPreElement[] = Array.from(
			this.el.nativeElement.querySelectorAll("pre")
		);
		codeBlocks.forEach((block) => {
			const copyButton: HTMLButtonElement = this._buildCopyButton(block);
			this._addClickListener(copyButton, block);
		});
	}

	private _addClickListener(
		buttonElement: HTMLButtonElement,
		preElement: HTMLPreElement
	): void {
		fromEvent<MouseEvent>(buttonElement, "click")
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this._copyToClipboard(buttonElement, preElement));
	}

	private _buildCopyButton(block: HTMLPreElement): HTMLButtonElement {
		const copyButton: HTMLButtonElement = this.render2.createElement("button");
		copyButton.textContent = "Copy";
		this.render2.addClass(copyButton, "copy-button");
		this.render2.addClass(copyButton, "button");
		this.render2.appendChild(block, copyButton);
		return copyButton;
	}

	private _copyToClipboard(
		buttonElement: HTMLButtonElement,
		preElement: HTMLPreElement
	): void {
		from(
			navigator.clipboard.writeText(
				preElement.firstElementChild!.textContent || ""
			)
		).subscribe({
			next: () => {
				buttonElement.textContent = "Copied";
				timer(700).subscribe(() => (buttonElement.textContent = "Copy"));
			},
			error: (err) => console.error(this.MSG_ERROR_COPY, err),
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
