import { Component, inject } from "@angular/core";
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-follow-dialog",
	standalone: true,
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatButtonModule,
    MatIconModule
	],
	templateUrl: "./follow-dialog.component.html",
	styleUrl: "./follow-dialog.component.scss",
})
export class FollowDialogComponent {
}
