import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Owner } from '../../models/owner';
import { OwnerService } from '../../services/owner.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  addresses: Address[] = []
  owners: Owner[] = []
  private destroy$ = new Subject<void>();
  showForm : boolean = false;
  addressForm!: FormGroup
  constructor(private router : Router, private addressService : AddressService,private fb: FormBuilder, private ownerService : OwnerService){

  } 
  logout(){
    ss : void sessionStorage.setItem("auth-token", "");
    ss2 : void sessionStorage.setItem("username", "");
    this.router.navigate(["/login"]);

  }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      // Controles para os campos que o usuário vai preencher
      // Não inclua 'id' ou 'proprietario' objeto aqui
      cep: ['', Validators.required], // Exemplo de validação simples
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''], // Campo opcional
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      proprietarioId: [Validators.required]
    });

    this.carregarLocais();
    this.loadOwners();
    
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

  loadOwners() {
    this.ownerService.getOwners()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (owners) => {
          this.owners = owners;
          console.log('Lista de owners recebida:');
          this.owners.forEach((owner, index) => {
            console.log(owner);
          });
        },
        error: (err) => {
          console.error('Erro ao carregar owners:', err);
        }
      });
  }
  addAddress(){
    
    if (this.addressForm.invalid) {
      console.log("Formulário inválido.");
      this.addressForm.markAllAsTouched(); // Mostra erros se houver
      return; // Interrompe se inválido
    }

    const formData = this.addressForm.value;
    const addressDTO: any = {
      cep: formData.cep,
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento || null, // Envia null se vazio
      bairro: formData.bairro,
      cidade: formData.cidade,
      uf: formData.uf,
      proprietarioId: formData.proprietarioId // Adiciona o ID do proprietário
    };
    this.addressService.addAddress(addressDTO)
    .pipe(
      takeUntil(this.destroy$),
       // Reseta o estado de submissão
    )
    .subscribe({
      next: (novoEnderecoSalvo) => {
        console.log('Endereço adicionado com sucesso:', novoEnderecoSalvo);
        this.addresses.push(novoEnderecoSalvo); // Adiciona na lista local
        this.showForm = false; // Esconde o formulário
        this.addressForm.reset(); // Limpa os campos do formulário
      },
      error: (err) => {
        console.error('Erro ao salvar endereço:', err);
        // Adicione feedback de erro para o usuário aqui, se desejar
      }
    });
  }

  displayForm(){
    this.showForm = !this.showForm
  }

  
  }

  
  

