import * as THREE from "three";

// Todas as funções abaixo geram texturas via canvas 2D no cliente — evita
// precisar de arquivos de imagem extras para partículas, folhas e relógios.

const cache = new Map<string, THREE.Texture>();

function memo(key: string, build: () => THREE.Texture): THREE.Texture {
  const cached = cache.get(key);
  if (cached) return cached;
  const tex = build();
  cache.set(key, tex);
  return tex;
}

/** Sprite circular com borda suave — usado em Points para névoa, poeira, brasas. */
export function texturaParticulaSuave(cor = "255,255,255"): THREE.Texture {
  return memo(`particula-${cor}`, () => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, `rgba(${cor},1)`);
    grad.addColorStop(0.4, `rgba(${cor},0.6)`);
    grad.addColorStop(1, `rgba(${cor},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

/** Silhueta de folha de bordo (maple), com nervura central sutil. */
export function texturaFolha(): THREE.Texture {
  return memo("folha", () => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    const pontas = 5;
    const rOut = size * 0.46;
    const rIn = size * 0.22;
    for (let i = 0; i < pontas * 2; i++) {
      const ang = (Math.PI / pontas) * i - Math.PI / 2;
      const r = i % 2 === 0 ? rOut : rIn;
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r * 1.05;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.quadraticCurveTo(x * 1.08, y * 1.08, x, y);
    }
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, -rOut, 0, rOut);
    grad.addColorStop(0, "#e8863a");
    grad.addColorStop(0.6, "#c8501f");
    grad.addColorStop(1, "#8a3410");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(60,20,5,0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -rOut * 0.8);
    ctx.lineTo(0, rOut * 0.75);
    for (let i = 1; i <= 4; i++) {
      const y = -rOut * 0.5 + i * (rOut * 0.3);
      ctx.moveTo(0, y);
      ctx.lineTo(rOut * 0.4, y + rOut * 0.25);
      ctx.moveTo(0, y);
      ctx.lineTo(-rOut * 0.4, y + rOut * 0.25);
    }
    ctx.stroke();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

/** Pétala arredondada com leve gradiente e veio central. */
export function texturaPetala(): THREE.Texture {
  return memo("petala", () => {
    const size = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.3, size * 0.46, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, -size * 0.1, 2, 0, 0, size * 0.46);
    grad.addColorStop(0, "#ffd9e6");
    grad.addColorStop(0.55, "#f6a8c2");
    grad.addColorStop(1, "#e888ab");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(160,60,90,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.4);
    ctx.lineTo(0, size * 0.4);
    ctx.stroke();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

/** Pena estilizada, alongada e translúcida nas bordas. */
export function texturaPena(): THREE.Texture {
  return memo("pena", () => {
    const w = 64;
    const h = 160;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h * 0.1, 0, h / 2);
    ctx.quadraticCurveTo(-w / 2, -h * 0.1, 0, -h / 2);
    const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    grad.addColorStop(0, "rgba(230,225,245,0.95)");
    grad.addColorStop(1, "rgba(200,192,224,0.5)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(150,140,180,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2 + 4);
    ctx.lineTo(0, h / 2 - 4);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

/** Mostrador de relógio com marcações — aplicado a um disco atrás do anel dourado. */
export function texturaRelogio(): THREE.Texture {
  return memo("relogio-mostrador", () => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.44;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(20,15,35,0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(200,160,48,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = "rgba(240,236,255,0.85)";
    for (let i = 0; i < 12; i++) {
      const ang = (Math.PI / 6) * i;
      const inner = i % 3 === 0 ? r * 0.78 : r * 0.86;
      ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner);
      ctx.lineTo(cx + Math.cos(ang) * r * 0.94, cy + Math.sin(ang) * r * 0.94);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(240,200,74,0.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}

/** Textura de nuvens para a lua (usada como camada semi-transparente). */
export function texturaNuvens(): THREE.Texture {
  return memo("nuvens", () => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 8 + Math.random() * 26;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(255,255,255,0.55)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  });
}
