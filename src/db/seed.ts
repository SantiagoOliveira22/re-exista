import crypto from "crypto";
import readline from "readline";

import { db } from ".";
import { categoryTable, professionalTable, userTable } from "./schema";
import { eq, count } from "drizzle-orm";

function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "sim");
    });
  });
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

const categories = [
  { name: "Barbearia" },
  { name: "Consultoria Financeira" },
  { name: "Saúde" },
  { name: "Outros Serviços" },
];

const professionals = [
  // Saúde Pública
  {
    categoryName: "Saúde",
    name: "PROTIG - Programa de Identidade de Gênero do Hospital de Clínicas",
    pronoun: "",
    specialty: "Saúde Pública",
    address:
      "Hospital de Clínicas - Rua Ramiro Barcelos, 2350 Bloco A, Av. Protásio Alves, 211 - Bloco B e C - Santa Cecília",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "",
    contactEmail: "",
    agreements: undefined,
    description:
      "Pedir encaminhamento pela UBS da sua cidade. Fila grande, média de 2 anos de espera pra primeira consulta. Tem hormonização e cirurgias (mastectomia, histerectomia, colpectomia). Até agora não tem cirurgia genital para homens trans.",
  },
  {
    categoryName: "Saúde",
    name: "Ambulatório T Porto Alegre",
    pronoun: "",
    specialty: "Saúde Pública",
    address: "R. Capitão Montanha, 27 - 1º andar - Centro Histórico",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99506-9632",
    contactEmail: "ambulatoriotpoa@gmail.com",
    agreements: [],
    description:
      "Marcação de consulta pelo WhatsApp. Tem hormonização e encaminhamento para qualquer outra demanda de saúde que não tenha relação com ser trans.",
  },
  {
    categoryName: "Saúde",
    name: "Ambulatório GHC - AMIG",
    pronoun: "",
    specialty: "Saúde Pública",
    address:
      "Unidade de Saúde Conceição (R. Álvares Cabral, 429, Bairro Cristo Redentor)",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3255-1726",
    contactEmail: "",
    agreements: [],
    description:
      "Os agendamentos podem ser feitos pelo WhatsApp através do número 51 32551726, além de acontecer o acolhimento das demandas no dia. O AMIG conta com uma equipe multiprofissional e tem objetivo de promover uma atenção integral e não patologizadora de pessoas trans, travestis e não-binárias.",
  },
  {
    categoryName: "Saúde",
    name: "TRIS - Feevale",
    pronoun: "",
    specialty: "Saúde Pública",
    address: "R. Rubem Berta, 200 - Vila Nova",
    city: "Novo Hamburgo",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3586-8800",
    contactEmail: "",
    agreements: [],
    description:
      "Agendamentos: encaminhamento pelo posto de saúde ou agendar direto para o CIES da Feevale (51 35868800) pedindo o ambulatório de atendimento trans.",
  },

  // Psicologia
  {
    categoryName: "Saúde",
    name: "Caiuá Silva dos Santos",
    pronoun: "Ele/dele",
    specialty: "Psicologia",
    address: "Av. Carlos Gomes, 1492 - sala 401 - Auxiliadora",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98424-0623",
    contactEmail: "",
    agreements: [],
    description:
      "Especialista em sexualidade. Atendo online e presencial no Bom Fim (Porto Alegre).",
  },
  {
    categoryName: "Saúde",
    name: "Vincent Goulart",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Mostardeiro, 05 - sala 310 - Independência",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 9919-6327",
    contactEmail: "",
    agreements: ["Não"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Ian Barcellos",
    pronoun: "Ele/dele",
    specialty: "Psicologia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 98181-5819",
    contactEmail: "",
    agreements: ["Unimed"],
    description:
      "Atende adultos e adolescentes (a partir dos 12 anos); realiza atendimentos on-line.",
  },
  {
    categoryName: "Saúde",
    name: "Augusto Dias",
    pronoun: "",
    specialty: "Psicologia",
    address: "Av. Lageado, 1212 - sala 308 - Petrópolis",
    city: "Campo Bom, Novo Hamburgo",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99935-9030",
    contactEmail: "",
    agreements: ["Ipê"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Duda Steiger",
    pronoun: "",
    specialty: "Psicologia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 99592-2274",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psicológico online.",
  },
  {
    categoryName: "Saúde",
    name: "Fábio Bottari",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Mostardeiro, 05 - sala 501 - Independência",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99842-8854",
    contactEmail: "",
    agreements: ["CCG"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Fernanda Carrion da Silva",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Paulo Setúbal, 25 - sala 404 - Passo d'Areia",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99680-8673",
    contactEmail: "",
    agreements: ["Bradesco", "Unimed"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Itauane de Oliveira",
    pronoun: "",
    specialty: "Psicologia",
    address:
      "CliniOnco - Rua Dona Laura, 226 / Moinhos de Vento; Clínica Affabile - R. Miguel Tostes, 201 - Sala 810 e 811 / Rio Branco",
    city: "Santa Cruz do Sul",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 9662-4292",
    contactEmail: "",
    agreements: ["Unimed"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "José Stona",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Cel. Bordini, 830 - sala 403 - Auxiliadora",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98952-4268",
    contactEmail: "",
    agreements: ["Bradesco", "Saude Caixa", "Unimed"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Melissa",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Ramiro Barcelos, 910 - sala 403 - Moinhos de Vento",
    city: "Santa Cruz do Sul",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98122-9356",
    contactEmail: "",
    agreements: ["DoctorClin"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Ramiro Figueiredo Catelan",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Getúlio Vargas, 412 - cj 5 - Centro",
    city: "Santa Cruz do Sul",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99155-5327",
    contactEmail: "",
    agreements: ["Unimed"],
    description: "Atendimento psicológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Victória Wojtysiak",
    pronoun: "",
    specialty: "Psicologia",
    address: "R. Sete de Setembro, 401 - Sala 03 - Centro",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 98961-3151",
    contactEmail: "",
    agreements: [
      "AFISVEC",
      "Amil",
      "Assefaz",
      "Associação de Saúde Rural de Alegrete",
      "Bradesco",
      "Geap Saúde",
      "Petrobras",
      "SAMEISA",
      "Saude Caixa",
      "Unimed",
    ],
    description: "Atendimento psicológico online.",
  },
  {
    categoryName: "Saúde",
    name: "Fabiana Fagundez",
    pronoun: "",
    specialty: "Psicologia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 99993-3051",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psicológico online.",
  },
  {
    categoryName: "Saúde",
    name: "Boaventura Meleu",
    pronoun: "",
    specialty: "Psicologia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 99919-5972",
    contactEmail: "boaventurameleu@outlook.com",
    agreements: [],
    description:
      "Utilizo a terapia cognitivo comportamental como abordagem terapêutica, colaborando com as técnicas da terapia afirmativa, podendo assim ampliar as possibilidades de recursos e estratégias a população LGBTQIA+. Presto atendimento breve focal e também desenvolvimento de psicoeducação para enriquecimento psicológico.",
  },
  {
    categoryName: "Saúde",
    name: "Nathália Verdier",
    pronoun: "Ela/dela",
    specialty: "Psicologia",
    address: "",
    city: "Rio das Ostras",
    state: "RJ",
    format: "Online",
    contactPhone: "(22) 99839-0659",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psicológico online.",
  },
  {
    categoryName: "Saúde",
    name: "Mikael Vilela",
    pronoun: "Ele/dele",
    specialty: "Psicologia",
    address: "",
    city: "Online",
    state: "Online",
    format: "Online",
    contactPhone: "(64) 99604-7724",
    contactEmail: "",
    agreements: [],
    description:
      "Atendimento para adultos e adolescentes pela terapia cognitivo comportamental e terapia do esquema (TCC e TE).",
  },

  // Psiquiatria
  {
    categoryName: "Saúde",
    name: "Dr. Boris Daronch",
    pronoun: "",
    specialty: "Psiquiatria",
    address:
      "Porto Alegre - Av. Assis Brasil, 3535 - sala 1010 - Cristo Redentor; Capão da Canoa - Av. Ubirajara, 678 - Centro; Torres - Av. Ge",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3348-2564",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psiquiátrico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Roberta Rodrigues",
    pronoun: "",
    specialty: "Psiquiatria",
    address: "R. Schiller, 28 - Rio Branco",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99962-8798",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psiquiátrico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dre. Renée Cessel",
    pronoun: "",
    specialty: "Psiquiatria",
    address: "",
    city: "São Paulo",
    state: "SP",
    format: "Online",
    contactPhone: "(11) 93151-7211",
    contactEmail: "",
    agreements: [],
    description: "Atendimento psiquiátrico online.",
  },

  // Endocrinologia
  {
    categoryName: "Saúde",
    name: "Dra. Adriana Fornari",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "R. Luciana de Abreu, 471 - sala 402 - Moinhos de Vento",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3022-5450",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dr. Dimitris Rados",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "R. Dr. José Mário Mônaco, 227 - sala 905 - Centro",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99327-0372",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Natalia Fernandes",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "Av. Prefeito Cláudio Ribeiro, 78 - Balneário Remanso",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3339-4535",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Paloma",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99856-4028",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Roberta de Pádua Borges",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(51) 98934-4205",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico online.",
  },
  {
    categoryName: "Saúde",
    name: "Dr. Umar M Abdalla",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Caxias do Sul",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3214-4074",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Paloma Cruz",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3292-0240",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Adriana Valenti",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98411-3685",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Laura Fachin Greca",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3030-0480",
    contactEmail: "",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Vanessa Cabrera",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99322-9290",
    contactEmail: "vanessa.dra@gmail.com",
    agreements: [],
    description: "Atendimento endocrinológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Elisa Carvalho Gallas",
    pronoun: "",
    specialty: "Endocrinologista",
    address: "Porto Alegre, Capão da Canoa, Torres",
    city: "Capão da Canoa, Porto Alegre, Torres",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98045-9273",
    contactEmail: "elisagallas@gmail.com",
    agreements: [],
    description: "Atendimento endocrinológico em múltiplas cidades.",
  },

  // Ginecologia
  {
    categoryName: "Saúde",
    name: "Dra. Sibele Klitke",
    pronoun: "",
    specialty: "Ginecologista",
    address: "Rua Lopo Gonçalves, 103 - Cidade Baixa",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99711-4050",
    contactEmail: "agendasdrasibele@gmail.com",
    agreements: [],
    description: "Atendimento ginecológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Dione Maria Lucho",
    pronoun: "",
    specialty: "Ginecologista",
    address: "R. José do Patrocínio, 754 - Cidade Baixa",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3332-5864",
    contactEmail: "",
    agreements: [],
    description: "Atendimento ginecológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Lisiane Lui",
    pronoun: "",
    specialty: "Ginecologista",
    address: "R. Gen. Lima e Silva, 1064 - Cidade Baixa",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99571-6688",
    contactEmail: "",
    agreements: [],
    description: "Atendimento ginecológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Margaret H Schacker",
    pronoun: "",
    specialty: "Ginecologista",
    address: "R Giordano Bruno 321, sala 102, Rio Branco",
    city: "Sapiranga",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3134-2520",
    contactEmail: "",
    agreements: [],
    description: "Atendimento ginecológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Andreia Meine",
    pronoun: "",
    specialty: "Ginecologista",
    address: "",
    city: "Sapiranga",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 2500-1283",
    contactEmail: "dra.andreiameine@gmail.com.br",
    agreements: [],
    description: "Atendimento ginecológico especializado.",
  },
  {
    categoryName: "Saúde",
    name: "Dra. Joyce de Assis Vieira",
    pronoun: "Ela/dela",
    specialty: "Ginecologista, Obstetra",
    address: "Rua Sena Madureira, 667 - Vila Clementino | (Plures Care)",
    city: "São Paulo",
    state: "SP",
    format: "Online",
    contactPhone: "",
    contactEmail: "",
    agreements: [],
    description:
      "Sou médica Ginecologista e Obstetra, trabalho com ênfase em contracepção, aconselhamento pré concepcional, rotina Ginecológica e pré-natal.",
  },

  // Cirurgia Plástica
  {
    categoryName: "Saúde",
    name: "Dr. Carlos Terrazas",
    pronoun: "",
    specialty: "Cirurgia Plástica",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 3328-0288",
    contactEmail: "clinicaterrazas@clinicaterrazas.com.br",
    agreements: [],
    description: "Cirurgia plástica especializada.",
  },
  {
    categoryName: "Saúde",
    name: "Dr. Felipe de David",
    pronoun: "",
    specialty: "Cirurgia Plástica",
    address: "",
    city: "Bento Gonçalves",
    state: "RS",
    format: "Presencial",
    contactPhone: "(54) 99970-4113",
    contactEmail: "contato@felipededavid.com.br",
    agreements: [],
    description: "Cirurgia plástica especializada.",
  },

  // Mastologia
  {
    categoryName: "Saúde",
    name: "Dra. Daniela Cornelio",
    pronoun: "Ela/dela",
    specialty: "Mastologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98964-0606",
    contactEmail: "dra.danielacornelio@gmail.com",
    agreements: [],
    description: "Porto Alegre e São Paulo +700 Mastectomias realizadas!",
  },

  // Neurologia
  {
    categoryName: "Saúde",
    name: "Dr. Leonardo Martins de Paula",
    pronoun: "Ele/dele",
    specialty: "Neurologista",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "(55) 99726-8250",
    contactEmail: "",
    agreements: [],
    description:
      "Atendimentos em neurologia clínica, de forma personalizada e humanizada - consulta completa, realizada com calma, para você poder explicar seus sintomas neurológicos e chegarmos juntos a um diagnóstico e tratamento.",
  },

  // Barbearia
  {
    categoryName: "Barbearia",
    name: "Barber Poc",
    pronoun: "",
    specialty: "Barbearia, Salão de Beleza",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99299-9131",
    contactEmail: "",
    agreements: [],
    description: "Cortes, barbas e cores sem gênero e sem preconceito.",
  },
  {
    categoryName: "Barbearia",
    name: "Navalha Maravilha",
    pronoun: "",
    specialty: "Barbearia, Salão de Beleza",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99605-0754",
    contactEmail: "",
    agreements: [],
    description:
      "A Navalha Maravilha nasceu de um sonho. Um sonho de que poderia existir em Porto Alegre uma barbearia onde qualquer pessoa pudesse entrar e se sentir segura, acolhida e, mais do que isso, onde ela pudesse ser quem ela é! Somos um local inclusivo onde prezamos pela igualdade e respeito às diferenças.",
  },
  {
    categoryName: "Barbearia",
    name: "DROP Barber Shop",
    pronoun: "",
    specialty: "Barbearia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99812-7021",
    contactEmail: "",
    agreements: [],
    description: "Barbearia especializada.",
  },
  {
    categoryName: "Barbearia",
    name: "Ravi",
    pronoun: "Ele/dele",
    specialty: "Barbearia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99856-6993",
    contactEmail: "",
    agreements: [],
    description: "Barbeiro especializado.",
  },
  {
    categoryName: "Barbearia",
    name: "Tales Ferreira",
    pronoun: "Ele/dele",
    specialty: "Barbearia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99429-3790",
    contactEmail: "",
    agreements: [],
    description: "Barbeiro especializado.",
  },
  {
    categoryName: "Barbearia",
    name: "Tópher",
    pronoun: "",
    specialty: "Barbearia",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 99450-7846",
    contactEmail: "",
    agreements: [],
    description: "Barbearia especializada.",
  },

  // Consultoria Financeira
  {
    categoryName: "Consultoria Financeira",
    name: "Thomas Escouto Trindade",
    pronoun: "Ele/dele",
    specialty: "Contabilidade",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Online",
    contactPhone: "",
    contactEmail: "thomas.escouto@gmail.com",
    agreements: [],
    description:
      "Foco em declaração de IR (Imposto de Renda) e questões relacionadas à Departamento Pessoal.",
  },
  {
    categoryName: "Consultoria Financeira",
    name: "Bruno Theodoro Ferreira Vitoriano",
    pronoun: "Ele/dele",
    specialty: "Consultoria Financeira",
    address: "Rua General Lima e Silva, 1064 - Cidade Baixa",
    city: "Fortaleza",
    state: "CE",
    format: "Online",
    contactPhone: "",
    contactEmail: "brunotheovitoriano@gmail.com",
    agreements: [],
    description:
      "Prestação de serviços de consultoria financeira com metodologia própria. Serviços de organização orçamentária, análise financeira e educação para investidores iniciantes. Marca própria: Transformation Financial Plans.",
  },

  // Outros Serviços
  // Tatuagem
  {
    categoryName: "Outros Serviços",
    name: "Bruna Negre",
    pronoun: "Ela/dela",
    specialty: "Tatuagem",
    address: "",
    city: "Porto Alegre",
    state: "RS",
    format: "Presencial",
    contactPhone: "(51) 98988-7160",
    contactEmail: "negrescotattoo@gmail.com",
    agreements: [],
    description:
      "Faço tatuagens autorais e exclusivas, em preto, com variação de traço, muita textura e carinho.",
  },
  {
    categoryName: "Outros Serviços",
    name: "HTA Resistência",
    pronoun: "",
    specialty: "Grupos",
    address: "",
    city: "Online",
    state: "Online",
    format: "Online",
    contactPhone: "",
    contactEmail: "",
    agreements: [],
    description:
      "Direitos humanos incondicionais e irrevogáveis. Direito integral a identidade de gênero. Direito integral a sexualidade. Dever de respeitar uns aos outros. Dever de fazer e divulgar a militância pelas pessoas trans.",
  },
  {
    categoryName: "Outros Serviços",
    name: "gamers LGBTQIAP+",
    pronoun: "",
    specialty: "Grupos",
    address: "",
    city: "Online",
    state: "Online",
    format: "Online",
    contactPhone: "",
    contactEmail: "",
    agreements: [],
    description: "Grupo para a galera que curte jogos.",
  },
  {
    categoryName: "Outros Serviços",
    name: "Grupo roda trans Tinga",
    pronoun: "",
    specialty: "Grupos",
    address: "",
    city: "Online",
    state: "Online",
    format: "Online",
    contactPhone: "",
    contactEmail: "",
    agreements: [],
    description:
      "Coordenação: Atena. Espaço exclusivo para pessoas trans binárias e não binárias. Princípios: ESCUTA ○ RESPEITO ○ ACOLHIMENTO ○ AFETO. Produção: CAUS - Coletivo Antropologia Urbana Social. Enviar mensagem solicitando entrada para Atena (51) 99360-1059. Link: https://chat.whatsapp.com/IO9cy6u7MhVGhAatQJgBBj",
  },
];

async function main() {
  console.log("🌱 Iniciando o seeding do banco de dados...");

  try {
    const [catCount] = await db.select({ total: count() }).from(categoryTable);
    const [profCount] = await db.select({ total: count() }).from(professionalTable);

    if (catCount.total > 0 || profCount.total > 0) {
      console.log("");
      console.log("⚠️  ATENÇÃO: O banco de dados já contém dados!");
      console.log(`   - ${catCount.total} categoria(s)`);
      console.log(`   - ${profCount.total} profissional(is)`);
      console.log("");
      console.log("   Executar o seed vai APAGAR TODOS os dados acima");
      console.log("   e substituir pelos dados padrão do seed.");
      console.log("");

      const confirmed = await askConfirmation(
        '   Digite "sim" para confirmar a exclusão e repopulação: ',
      );

      if (!confirmed) {
        console.log("\n❌ Seed cancelado. Nenhum dado foi alterado.");
        return;
      }

      console.log("");
    }

    console.log("🧹 Limpando dados existentes...");
    await db.delete(professionalTable);
    await db.delete(categoryTable);
    console.log("✅ Dados limpos com sucesso!");

    // Criar ou obter usuário de teste para os profissionais
    const testUserId = "seed-user-id";
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, testUserId))
      .limit(1);

    if (existingUser.length === 0) {
      console.log("👤 Criando usuário de teste...");
      await db.insert(userTable).values({
        id: testUserId,
        name: "Usuário de Teste (Seed)",
        email: `seed-${Date.now()}@test.com`,
        emailVerified: false,
      });
      console.log("✅ Usuário de teste criado!");
    } else {
      console.log("✅ Usuário de teste já existe!");
    }

    // Inserir categorias primeiro
    const categoryMap = new Map<string, string>();

    console.log("📂 Criando categorias...");
    for (const categoryData of categories) {
      const categoryId = crypto.randomUUID();
      const categorySlug = generateSlug(categoryData.name);

      console.log(`  📁 Criando categoria: ${categoryData.name}`);

      await db.insert(categoryTable).values({
        id: categoryId,
        name: categoryData.name,
        slug: categorySlug,
      });

      categoryMap.set(categoryData.name, categoryId);
    }

    // Inserir profissionais
    console.log(
      `📝 Iniciando inserção de ${professionals.length} profissionais...`,
    );
    let professionalsCreated = 0;
    let professionalsFailed = 0;

    for (const professionalData of professionals) {
      try {
        // Validar campos obrigatórios
        if (!professionalData.name || !professionalData.name.trim()) {
          console.error(`❌ Erro: Nome não pode estar vazio para profissional`);
          professionalsFailed++;
          continue;
        }

        if (!professionalData.city || !professionalData.city.trim()) {
          console.error(
            `❌ Erro: Cidade não pode estar vazia para "${professionalData.name}"`,
          );
          professionalsFailed++;
          continue;
        }

        const professionalId = crypto.randomUUID();
        const professionalSlug = generateSlug(professionalData.name);
        const categoryId = categoryMap.get(professionalData.categoryName);

        if (!categoryId) {
          console.error(
            `❌ Erro: Categoria "${professionalData.categoryName}" não encontrada para "${professionalData.name}"`,
          );
          professionalsFailed++;
          continue;
        }

        console.log(`👤 Criando profissional: ${professionalData.name}`);

        await db.insert(professionalTable).values({
          id: professionalId,
          userId: testUserId,
          name: professionalData.name.trim(),
          slug: professionalSlug,
          pronoun:
            professionalData.pronoun && professionalData.pronoun.trim()
              ? professionalData.pronoun.trim()
              : null,
          specialty:
            professionalData.specialty && professionalData.specialty.trim()
              ? professionalData.specialty.trim()
              : null,
          address:
            professionalData.address && professionalData.address.trim()
              ? professionalData.address.trim()
              : null,
          city: professionalData.city.trim(),
          state:
            professionalData.state && professionalData.state.trim()
              ? professionalData.state.trim()
              : null,
          format:
            professionalData.format && professionalData.format.trim()
              ? professionalData.format.trim()
              : null,
          contactPhone:
            professionalData.contactPhone &&
            professionalData.contactPhone.trim()
              ? professionalData.contactPhone.trim()
              : null,
          contactEmail:
            professionalData.contactEmail &&
            professionalData.contactEmail.trim()
              ? professionalData.contactEmail.trim()
              : null,
          agreements:
            professionalData.agreements &&
            Array.isArray(professionalData.agreements) &&
            professionalData.agreements.length > 0
              ? JSON.stringify(professionalData.agreements)
              : null,
          description:
            professionalData.description && professionalData.description.trim()
              ? professionalData.description.trim()
              : null,
          categoryId: categoryId,
        });

        professionalsCreated++;
        console.log(`  ✅ Profissional criado com sucesso!`);
      } catch (error: unknown) {
        console.error(
          `❌ Erro ao criar profissional "${professionalData.name}":`,
        );
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`   Detalhes:`, errorMessage);
        if (error && typeof error === 'object' && 'code' in error) {
          console.error(`   Código do erro:`, error.code);
        }
        professionalsFailed++;
        // Continue com o próximo profissional ao invés de parar tudo
      }
    }

    console.log("\n✅ Seeding concluído!");
    console.log(
      `📊 Resumo: ${categories.length} categorias criadas, ${professionalsCreated} profissionais criados, ${professionalsFailed} falharam.`,
    );

    if (professionalsFailed > 0) {
      console.warn(
        `⚠️  Atenção: ${professionalsFailed} profissionais não puderam ser criados. Verifique os erros acima.`,
      );
    }
  } catch (error) {
    console.error("❌ Erro durante o seeding:", error);
    throw error;
  }
}

main().catch(console.error);
