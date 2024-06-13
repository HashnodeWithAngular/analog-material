import { Component, inject, Input, OnInit } from "@angular/core";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { IconService } from "../services/icon.service";

@Component({
	selector: "app-svg-icon",
	standalone: true,
	imports: [],
	template: ` <div [innerHTML]="trustedSvgContent"></div> `,
	styles: [``],
})
export class SvgIconComponent implements OnInit {
	@Input() icon!: string;

	svgContent!: string;
	trustedSvgContent!: SafeHtml;
	iconService: IconService = inject(IconService);
	sanitizer: DomSanitizer = inject(DomSanitizer);

	ngOnInit(): void {
		this.iconService.getIcon(this.icon).subscribe((svgContent) => {
			this.trustedSvgContent =
				this.sanitizer.bypassSecurityTrustHtml(svgContent);
		});
	}

	ngOnChange(): void {
		this.iconService.getIcon(this.icon).subscribe((svgContent) => {
			this.trustedSvgContent =
				this.sanitizer.bypassSecurityTrustHtml(svgContent);
		});
	}
}
