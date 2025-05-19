import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CorridasService } from '../../service/corridas.service';

@Component({
  selector: 'app-corridas',
  templateUrl: './corridas.page.html',
  styleUrls: ['./corridas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CorridasPage implements OnInit {
  origem = '';
  destino = '';
  sugestoesOrigem: any[] = [];
  sugestoesDestino: any[] = [];
  apiKey = 'SUA_GOOGLE_API_KEY';
  corridas: any[] = [];
  dataAgendamento: string = '';
  horaAgendamento: string = '';
  dataAgendamentoFormatada: string = '';
  clienteBusca: string = '';
  clientesFiltrados: any[] = [];
  clienteSelecionado: any = null;
  mostrarCadastrarCliente = false;
  mostrarDateTime = false;
  eventoPopover: any = null;
  dataTemp: string = '';

  // Simulação de clientes (substitua por chamada ao seu service)
  clientes = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Santos' }
  ];

  constructor(private http: HttpClient, private corridasService: CorridasService) {}

  ngOnInit() {
    const agora = new Date();
    this.dataAgendamento = agora.toISOString().slice(0, 10); // yyyy-mm-dd
    this.horaAgendamento = agora.toTimeString().slice(0, 5); // HH:mm

    this.carregarCorridas();
  }

  buscarEnderecos(event: any, tipo: 'origem' | 'destino') {
    const valor = event.target.value;
    if (valor.length < 3) return;

    this.http.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${valor}&key=${this.apiKey}&language=pt-BR&components=country:br`)
      .subscribe((res: any) => {
        if (tipo === 'origem') {
          this.sugestoesOrigem = res.predictions;
        } else {
          this.sugestoesDestino = res.predictions;
        }
      });
  }

  selecionarEndereco(sugestao: any, tipo: 'origem' | 'destino') {
    if (tipo === 'origem') {
      this.origem = sugestao.description;
      this.sugestoesOrigem = [];
    } else {
      this.destino = sugestao.description;
      this.sugestoesDestino = [];
    }
  }

  buscarCliente(event: any) {
    const valor = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nome.toLowerCase().includes(valor)
    );
    this.mostrarCadastrarCliente = this.clientesFiltrados.length === 0 && valor.length > 2;
  }

  selecionarCliente(cliente: any) {
    this.clienteSelecionado = cliente;
    this.clienteBusca = cliente.nome;
    this.clientesFiltrados = [];
    this.mostrarCadastrarCliente = false;
  }

  abrirCadastroCliente() {
    // Aqui você pode abrir um modal ou navegar para a página de cadastro de cliente
    // Exemplo: this.router.navigate(['/cadastro-cliente']);
  }

  solicitarCorrida() {
    const dataHoraCompleta = `${this.dataAgendamento}T${this.horaAgendamento}:00`;
    const novaCorrida = {
      origem: this.origem,
      destino: this.destino,
      status: 'pendente',
      data: dataHoraCompleta,
      passageiro: this.clienteSelecionado ? this.clienteSelecionado.nome : this.clienteBusca
    };

    this.corridasService.adicionarCorrida(novaCorrida).subscribe(() => {
      this.origem = '';
      this.destino = '';
      this.carregarCorridas(); // Atualiza a lista após criar
    });
  }

  carregarCorridas() {
    this.corridasService.listarCorridas().subscribe(data => {
      this.corridas = data.map(corrida => ({
        ...corrida,
        dataFormatada: this.formatarDataHora(corrida.data)
      }));
    });
  }

  excluirCorrida(id: number | string) {
    this.corridasService.excluirCorrida(id).subscribe(() => {
      this.carregarCorridas();
    });
  }

  editarCorrida(corrida: any) {
    // Aqui você pode abrir um modal ou navegar para uma página de edição
    // Exemplo simples: alterar status
    const novosDados = { ...corrida, status: 'finalizada' };
    this.corridasService.editarCorrida(corrida.id, novosDados).subscribe(() => {
      this.carregarCorridas();
    });
  }

  abrirPopoverDateTime(event: any) {
    this.eventoPopover = event;
    this.mostrarDateTime = true;
  }

  confirmarDataHora() {
    this.dataAgendamento = this.dataTemp;
    this.mostrarDateTime = false;
  }

  selecionarData(event: any) {
    this.dataTemp = event.detail.value;
  }

  onDateChange(event: any) {
    const value = event.detail.value;
    this.dataTemp = Array.isArray(value) ? value[0] : (value || '');
  }

  formatarDataHora(valor: string): string {
    if (!valor) return '';
    const data = new Date(valor);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }
}
