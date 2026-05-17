import { useState, useEffect } from "react";
import imgFundo from "./assets/imgFundo.jpeg"
import gta6logo from "./assets/gta6logo.png"

const data_lancamento = new Date("2026-11-19T00:00:00");
const data_anuncio = new Date("2023-11-08T00:00:00");
const data_trailer1 = new Date("2023-12-04T00:00:00");
const data_trailer2 = new Date("2025-05-06T00:00:00");
const tempoTotal = data_lancamento - data_trailer1;

const eventos = [
  {
    nome: "Trailer 1",
    data: data_trailer1,
    link: "https://www.youtube.com/watch?v=QdBZY2fkU-0"
  },
    {
    nome: "Trailer 2",
    data: data_trailer2,
    link: "https://www.youtube.com/watch?v=VQRLujxTm3c&t=1s"
  }
]

function Pad(n, len = 2){
  return String(n).padStart(len, "0");
}

function ObterTempoRestante(){
  const dataAtual = new Date();
  const diferenca = data_lancamento - dataAtual;

  //a diferença está em milissegundos
  const dias = Math.floor(diferenca / (1000*60*60*24));
  const horas = Math.floor((diferenca % (1000*60*60*24)) / (1000*60*60));
  const minutos = Math.floor((diferenca % (1000*60*60)) / (1000*60));
  const segundos = Math.floor((diferenca % (1000*60)) / 1000);
  
  const tempoPassado = dataAtual - data_trailer1;
  const percentual = Math.min(100, Math.max(0, (tempoPassado / tempoTotal) * 100));

  return { dias, horas, minutos, segundos, percentual };
}

function PercentualPosicaoProgresso(data) {
  const inicio = data_anuncio.getTime();
  const fim = data_lancamento.getTime();
  const atual = data.getTime();

  return ((atual - inicio) / (fim - inicio) * 100);
}

function BlocoTempo({ valor, textoValor, digitos = 2, flash }) {
  return (
    <div style = {styles.blocoTempo}>
      <div 
        style={{
          ...styles.numTempo,          
          background: "radial-gradient(225.46% 169.6% at 50% 90%,#ffd27b 0,#df3a93 33.33%,#5c1663 66.67%,rgba(32,31,66,0) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
        {Pad(valor, digitos)}
    </div>
    <div style={styles.textoTempo}>{textoValor}</div>
  </div>
  );
}

function SeparadorTempo() {
  return <div style={styles.separador}>:</div>;
}

export default function ContagemParaGTAVI(){
  const [tempo, atualizarTempo] = useState(ObterTempoRestante());
  const [flash, Piscar] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      atualizarTempo(ObterTempoRestante());
      Piscar(true);
      definirTimeout(() => Piscar(false), 150);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&display=swap');
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.1; }
      }
      body {
        margin: 0;
        padding: 0;
      }
    `}</style>
  
  <div style={styles.telaFundo}>

    <img src={imgFundo} style={styles.imagemTelaFundo} />
    
    <div style={styles.overlay}></div>

    <div style={styles.logo}>
      <div style={{
        backgroundImage: `url(${gta6logo})`,
        width: "160px",
        height: "120px",
        backgroundSize: "cover",
        marginTop: "10px"
      }}
      >
      </div>
    </div>

    <div style={styles.textoLancamento}>Faltam apenas...</div>

    <div style={styles.contador}>
      <BlocoTempo valor={tempo.dias} textoValor="Dias" digitos={3} />
      <SeparadorTempo />
      <BlocoTempo valor={tempo.horas} textoValor="Horas" />
      <SeparadorTempo />
      <BlocoTempo valor={tempo.minutos} textoValor="Minutos" />
      <SeparadorTempo />
      <BlocoTempo valor={tempo.segundos} textoValor="Segundos" flash={flash} />
    </div>
    
    <div style={styles.barraProgresso}>
      <div style={styles.progresso}>
        <div style={{
          ...styles.progressoPreenchimento,
          width: `${tempo.percentual.toFixed(2)}%`,
        }}
        />

        {eventos.map((evento, index) => (
          <div 
            key={evento.nome}
            style={{
              ...styles.marcadorEventoProgresso,
              left: `${PercentualPosicaoProgresso(evento.data)}%`
            }}
          >
            <a
              href={evento.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
            <div 
            style={{
              ...styles.pontoEventoProgresso,
              cursor: "pointer",
              transition: "0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.3)";
              e.currentTarget.style.boxShadow = "0 0 18px #df3a93";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px #df3a93";
            }}
            />
            </a>

            <div style={{
              ...styles.textoEventoProgresso,
              marginTop: index % 2 === 0 ? "10px" : "-40px"
            }}>
              {evento.nome}
            </div>
          </div>          
        ))}
        <div
            style={{
              ...styles.percentualProgresso,
              left: `${tempo.percentual.toFixed(2)}%`,
            }}
          >
            {tempo.percentual.toFixed(1)}%
        </div> 
      </div>
     </div>
  
    <div style={styles.dataLancamento}>Disponível em</div>
    <div style={styles.dataLancamento}>19 de novembro de 2026</div>

    <div>
    </div>
    
  </div>
</>
);
}

const styles = {
  blocoTempo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "100px"
  },
  numTempo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "80px",
    lineHeight: 1,
    width: "100px",
    textAlign: "center",
    letterSpacing: "-1px"
  },
  textoTempo: {
    fontSize: "15px",
    letterSpacing: "4px",
    color: "#ffff",
    textTransform: "uppercase",
    marginTop: "6px"
  },
  telaFundo: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  imagemTelaFundo: {
    width: "100vw",
    height: "100vh",
    display: "block",
    opacity: "0.8",
    filter: "brightness(0.3)",
    position: "absolute",
    inset: 0,
    zIndex: 0
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 1
  },
  logo: {
    position: "relative",
    marginTop: "1rem",
    marginBottom: "2rem",
    zIndex: 2
  },
  textoLancamento: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.5rem",
    fontSize: "15px",
    letterSpacing: "5px",
    color: "#ffff",
    textTransform: "uppercase"
  },
  contador: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "4rem"
  },
  separador: { 
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "60px",
    color: "#ffd278",
    lineHeight: 1,
    animation: "blink 1s step-end infinite"
  },
  barraProgresso: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "1000px",
    marginBottom: "3rem"
  },
  progresso: {
    height: "5px",
    background: "#ffffff0f",
    borderRadius: "1px",
    overflow: "hidden",
    marginBottom: "6px"
  },
  progressoPreenchimento: {
    height: "100%",
    background: "linear-gradient(90deg, #ffd687 0%, #df3a93 100%)",
    borderRadius: "1px",
    transition: "width 1s linear",
    boxShadow: "0 0 8px #ffd68733"
  },
  progressoTexto: {
    position: "relative",
    fontSize: "15px",
    letterSpacing: "3px",
    color: "#ffff",
    textTransform: "uppercase"
  },
  percentualProgresso: {
    position: "absolute",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontSize: "15px",
    letterSpacing: "3px",
    color: "#ffff",
    textTransform: "uppercase",
    marginTop: "10px"
  },
  marcadorEventoProgresso: {
    position: "absolute",
    top: "-8px",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  pontoEventoProgresso: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#ffd27b",
    boxShadow: "0 0 10px #df3a93",
    border: "2px solid #ffd27b"
  },
  textoEventoProgresso: {
    position: "relative",
    fontSize: "15px",
    letterSpacing: "3px",
    color: "#ffff",
    textTransform: "uppercase"
  },
  dataLancamento: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "60px",
    backgroundImage: "radial-gradient(circle at 50% 40vh,#ffd27b 0,#df3a93 60vh,#5c1663 100vh)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    zIndex: 2,
    marginBottom: "-15px"
  }
}