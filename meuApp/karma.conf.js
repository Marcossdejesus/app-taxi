// Arquivo de configuração do Karma, utilizado para rodar testes automatizados no Angular

module.exports = function (config) {
  config.set({
    basePath: '', // Diretório base para resolver padrões (paths)
    frameworks: ['jasmine', '@angular-devkit/build-angular'], // Frameworks de teste utilizados
    plugins: [
      require('karma-jasmine'), // Plugin para Jasmine
      require('karma-chrome-launcher'), // Plugin para rodar testes no Chrome
      require('karma-jasmine-html-reporter'), // Plugin para exibir resultados no navegador
      require('karma-coverage'), // Plugin para gerar relatório de cobertura de código
      require('@angular-devkit/build-angular/plugins/karma') // Plugin específico do Angular
    ],
    client: {
      jasmine: {
        // Aqui você pode adicionar opções de configuração para o Jasmine
        // Exemplo: random: false para desabilitar execução aleatória dos testes
        // Exemplo: seed: 4321 para definir uma seed específica
      },
      clearContext: false // Mantém o output do Jasmine Spec Runner visível no navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // Remove traces duplicadas no relatório HTML
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/app'), // Diretório para salvar os relatórios de cobertura
      subdir: '.', // Subdiretório para os relatórios
      reporters: [
        { type: 'html' }, // Gera relatório em HTML
        { type: 'text-summary' } // Gera resumo em texto
      ]
    },
    reporters: ['progress', 'kjhtml'], // Tipos de relatórios exibidos durante os testes
    port: 9876, // Porta do servidor de testes
    colors: true, // Exibe cores no terminal
    logLevel: config.LOG_INFO, // Nível de log
    autoWatch: true, // Observa arquivos e executa testes ao salvar
    browsers: ['Chrome'], // Navegador utilizado para rodar os testes
    singleRun: false, // Se true, executa os testes uma vez e finaliza
    restartOnFileChange: true // Reinicia os testes ao alterar arquivos
  });
};
