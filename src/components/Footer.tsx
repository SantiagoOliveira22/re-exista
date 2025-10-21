import React from "react";

function Footer() {
  return (
    <div className="w-full bg-gray-100 px-10 py-6 text-gray-800">
      <div className="flex justify-between">
        <div>
          <p className="text-[12px]">Re-exista</p>
          <p className="text-[10px]">
            Somos um Portal de Indicação pensado na comunidade e <br /> pessoas
            que buscam profissionais e empresas de qualquer área <br /> com quem
            possam se sentir à vontade.
          </p>
          <div className="flex gap-2">
            <p>Icone do Instagram</p>
            <p>Icone do Linkedin</p>
          </div>
        </div>

        <div className="text-[12px]">
          <p>Categorias</p>
        </div>

        <div className="text-[12px]">
          <p>Recursos</p>
          <p>Perguntas Frequentes</p>
        </div>

        <div className="text-[12px]">
          <p>Legal</p>
          <p>Termos de Uso</p>
          <p>Política de Privacidade</p>
          <p>Contato</p>
        </div>
      </div>
      <hr />
      <div className="flex-collunm text-center">
        <p className="text-[12px]">
          @copy re-exista. Todos os diretiros reservados.
        </p>
        <p className="text-[12px]">
          Feito com <em className="text-red-500">♥</em> por Santiago Oliveira
        </p>
      </div>
    </div>
  );
}

export default Footer;
