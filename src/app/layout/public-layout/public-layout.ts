import { Component } from '@angular/core';
import { Navbar } from '../components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../components/footer/footer";
import { AdminButton } from '../components/admin-button/admin-button';

@Component({
  selector: 'app-public-layout',
  imports: [
    Navbar,
    RouterOutlet,
    Footer,
    AdminButton
],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
