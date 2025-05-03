import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  addresses: Address[] = []
  private destroy$ = new Subject<void>();
  constructor(private router : Router, private addressService : AddressService){

  } 
  logout(){
    ss : void sessionStorage.setItem("auth-token", "");
    ss2 : void sessionStorage.setItem("username", "");
    this.router.navigate(["/login"]);

  }

  ngOnInit(): void {
    this.carregarLocais(); // <<< CHAMA O MÉTODO PARA CARREGAR OS DADOS
  }

  // Hook ngOnDestroy: Chamado quando o componente é destruído
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite um valor
    this.destroy$.complete(); // Completa o Subject para liberar recursos
  }


  carregarLocais(): void {
    this.addressService.getAddresses()
    .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Address[]) => {
          console.log('DADOS RECEBIDOS DIRETAMENTE NA FUNÇÃO NEXT:', data); // <-- É ESTE log que mostra []?
          this.addresses = data;
          console.log('THIS.ADDRESSES APÓS ATRIBUIÇÃO NA FUNÇÃO NEXT:', this.addresses); // E este?
      },
        
        error: (err) => {
          console.error('Erro ao carregar locais:', err);
          
        }
      });
      console.log(this.addresses)
  }
  addAddress(){
    
  }
  }

  
  

