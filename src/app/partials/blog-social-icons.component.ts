import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BlogLinks } from "../models/blog-info";
import { KeyValuePipe } from "@angular/common";

import { MatIcon, MatIconRegistry } from "@angular/material/icon";

@Component({
	selector: "app-blog-social-icons",
	standalone: true,
	imports: [KeyValuePipe, MatIcon],
	template: `<div class="social-links">
		@for (social of blogSocialLinks | keyvalue; track social) { @if
		(social.value) {
		<a href="{{ social.value }}" target="_blank" rel="noopener noreferrer">
			<mat-icon svgIcon="{{ social.key }}"></mat-icon>
		</a>
		} }
	</div> `,
	styles: `
  .social-links {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;

    a {
      mat-icon {
        height: 1.1rem;
        width: 1.1rem;
        padding-bottom: 0.4rem;
      }
    }
  }
  `,
})
export class BlogSocialIconsComponent {
	@Input() blogSocialLinks!: BlogLinks;

	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer
	) {
    const deployedUrl = "https://analog-hashnode.withangular.dev/";
		iconRegistry.addSvgIcon("twitter",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/twitter.svg`)
		);
		this.iconRegistry.addSvgIcon("instagram",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/instagram.svg`)
		);
		this.iconRegistry.addSvgIcon("github",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/github.svg`)
		);
		this.iconRegistry.addSvgIcon("website",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/website.svg`)
		);
		this.iconRegistry.addSvgIcon("hashnode",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/hashnode.svg`)
		);
		this.iconRegistry.addSvgIcon("youtube",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/youtube.svg`)
		);
		this.iconRegistry.addSvgIcon("dailydev",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/dailydev.svg`)
		);
		this.iconRegistry.addSvgIcon("linkedin",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/linkedin.svg`)
		);
		this.iconRegistry.addSvgIcon("mastodon",
			this.sanitizer.bypassSecurityTrustResourceUrl(`${deployedUrl}icons/mastodon.svg`)
		);
	}
}
