import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header.component";
import { FooterComponent } from "./components/footer.component";


@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	template: `
		<app-header />
		<router-outlet />
		<app-footer />
	`,
	styles: [
		`
			:host {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-height: 100vh;
				width: 100vw;
				overflow-x: hidden;
			}
		`,
	],
})
export class AppComponent {}
