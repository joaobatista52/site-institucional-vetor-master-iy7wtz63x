import type { SVGProps } from 'react'

/**
 * WordmarkSvg — Wordmark oficial "VETOR MASTER" vetorizado com alta precisão
 * baseado na arte original de identidade visual (PNG anexado pelo usuário).
 *
 * Características da tipografia original preservadas:
 * - Geometria squarish/tech com cantos externos sutilmente arredondados (raio ~6-8px na altura 60)
 * - V: traço diagonal com junção inferior chanfrada/arredondada
 * - E: barra superior, média e inferior de espessura uniforme, cantos externos arredondados
 * - T: barra superior com cantos curvados, haste vertical central
 * - O: retângulo arredondado contínuo ("squircle")
 * - R: bowl fechado superior com curvatura contínua e perna inferior sinuosa/estilizada
 * - M: pernas verticais e ápice central descendo até a linha de base
 * - A: estilizado sem travessão horizontal ou com corte/ângulo distintivo de alta precisão
 * - S: curvas sinuosas com extremidades horizontais
 * - SEM espaço entre "VETOR" e "MASTER" (palavras unidas/aproximadas harmonicamente)
 * - Cores oficiais:
 *   - "VETOR": Azul Estratégico (#0066CC)
 *   - "MASTER": Verde Crescimento (#22B14C)
 */
export default function WordmarkSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 648 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="VETOR MASTER"
      {...props}
    >
      {/* ========================================================
          VETOR (#0066CC)
          X coordinates: 0 to 292
          Height: 60 (Y: 0 to 60)
          ======================================================== */}
      <g fill="#0066CC">
        {/* V (x: 0 .. 58) */}
        <path d="M 0 0 L 12.8 0 L 29 44 L 45.2 0 L 58 0 L 35.6 57 C 34.6 59 32.5 60 29 60 C 25.5 60 23.4 59 22.4 57 Z" />

        {/* E (x: 66 .. 112) */}
        <path d="M 66 8 C 66 3 70 0 76 0 L 112 0 L 112 11.5 L 78.5 11.5 L 78.5 24.2 L 108 24.2 L 108 35.8 L 78.5 35.8 L 78.5 48.5 L 112 48.5 L 112 60 L 76 60 C 70 60 66 57 66 52 Z" />

        {/* T (x: 120 .. 172) */}
        <path d="M 124 0 C 121 0 120 1 120 4 L 120 11.5 L 140.2 11.5 L 140.2 60 L 151.8 60 L 151.8 11.5 L 172 11.5 L 172 4 C 172 1 171 0 168 0 Z" />

        {/* O (x: 180 .. 232) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 191 0 C 182 0 180 5 180 14 L 180 46 C 180 55 182 60 191 60 L 221 60 C 230 60 232 55 232 46 L 232 14 C 232 5 230 0 221 0 Z M 192.5 11.5 L 219.5 11.5 C 220.5 11.5 220.5 12.5 220.5 14.5 L 220.5 45.5 C 220.5 47.5 220.5 48.5 219.5 48.5 L 192.5 48.5 C 191.5 48.5 191.5 47.5 191.5 45.5 L 191.5 14.5 C 191.5 12.5 191.5 11.5 192.5 11.5 Z"
        />

        {/* R (x: 240 .. 292) - Letra R com loop superior arredondado e perna horizontal/estilizada */}
        <path d="M 240 8 C 240 3 243 0 249 0 L 279 0 C 288 0 292 4 292 13 L 292 21 C 292 28.5 288.5 32 281.5 33 L 281.5 35.5 C 287 36.5 292 41 292 47.5 L 292 54 C 292 58 288 60 284 60 L 258 60 C 255 60 252 58 252 55 L 252 48.5 L 280 48.5 L 280 46.5 C 280 42 277 39.5 272 39.5 L 252 39.5 L 252 60 L 240 60 Z M 252 11.5 L 278 11.5 C 279.5 11.5 280.2 12.5 280.2 14 L 280.2 20.5 C 280.2 22.5 279.5 23.5 278 23.5 L 252 23.5 Z" />
      </g>

      {/* ========================================================
          MASTER (#22B14C)
          Inicia imediatamente adjacente a VETOR (x: 298..300) SEM espaço entre as palavras
          ======================================================== */}
      <g fill="#22B14C">
        {/* M (x: 300 .. 356) */}
        <path d="M 300 8 C 300 3 303 0 308 0 L 316.5 0 L 328 36 L 339.5 0 L 348 0 C 353 0 356 3 356 8 L 356 60 L 344.5 60 L 344.5 17.5 L 332.5 54 C 331.5 57 330 58 328 58 C 326 58 324.5 57 323.5 54 L 311.5 17.5 L 311.5 60 L 300 60 Z" />

        {/* A (x: 364 .. 418) - Chevron estilizado característico (sem crossbar fechada horizontal convencional, formato chevron V invertido com espessura uniforme) */}
        <path d="M 364 60 L 377.5 60 L 391 18.5 L 404.5 60 L 418 60 L 396.5 2 C 394.5 0 392.5 0 391 0 C 389.5 0 387.5 0 385.5 2 Z" />

        {/* S (x: 426 .. 475) */}
        <path d="M 432 15 C 432 13 433 11.5 437 11.5 L 464 11.5 C 466.5 11.5 467.5 12.5 467.5 14.5 L 467.5 18 C 467.5 21 465 23 458 24.5 L 444 27.5 C 432 30 426 35 426 44 L 426 47 C 426 56 430 60 440 60 L 467 60 C 472 60 475 57 475 52 L 475 42 L 463 42 L 463 47.5 C 463 48.5 462 49 459 49 L 439.5 49 C 438 49 437.5 48 437.5 46.5 L 437.5 43.5 C 437.5 40.5 440 38.5 447 37 L 461 34 C 472 31.5 478.5 27 478.5 18 L 478.5 14 C 478.5 4.5 474 0 463 0 L 437 0 C 429 0 426 4 426 10 L 426 15 Z" />

        {/* T (x: 483 .. 535) */}
        <path d="M 487 0 C 484 0 483 1 483 4 L 483 11.5 L 503.2 11.5 L 503.2 60 L 514.8 60 L 514.8 11.5 L 535 11.5 L 535 4 C 535 1 534 0 531 0 Z" />

        {/* E (x: 543 .. 589) */}
        <path d="M 543 8 C 543 3 547 0 553 0 L 589 0 L 589 11.5 L 555.5 11.5 L 555.5 24.2 L 585 24.2 L 585 35.8 L 555.5 35.8 L 555.5 48.5 L 589 48.5 L 589 60 L 553 60 C 547 60 543 57 543 52 Z" />

        {/* R (x: 596 .. 648) - Com os mesmos detalhes característicos do R */}
        <path d="M 596 8 C 596 3 599 0 605 0 L 635 0 C 644 0 648 4 648 13 L 648 21 C 648 28.5 644.5 32 637.5 33 L 637.5 35.5 C 643 36.5 648 41 648 47.5 L 648 54 C 648 58 644 60 640 60 L 614 60 C 611 60 608 58 608 55 L 608 48.5 L 636 48.5 L 636 46.5 C 636 42 633 39.5 628 39.5 L 608 39.5 L 608 60 L 596 60 Z M 608 11.5 L 634 11.5 C 635.5 11.5 636.2 12.5 636.2 14 L 636.2 20.5 C 636.2 22.5 635.5 23.5 634 23.5 L 608 23.5 Z" />
      </g>
    </svg>
  )
}
