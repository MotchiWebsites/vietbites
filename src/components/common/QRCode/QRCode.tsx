"use client";
import { useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./QRCode.css";

export default function QRCode() {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const tiltRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const target = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

    useEffect(() => {
        const card = cardRef.current;
        const tilt = tiltRef.current;
        if (!card || !tilt) return;

        const maxTilt = 8; // deg
        const maxShift = 6; // px
        const damp = 0.12; // easing factor

        let rx = 0,
            ry = 0,
            tx = 0,
            ty = 0; // current state

        const animate = () => {
            rx += (target.current.rx - rx) * damp;
            ry += (target.current.ry - ry) * damp;
            tx += (target.current.tx - tx) * damp;
            ty += (target.current.ty - ty) * damp;

            // inner tilt
            tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
            // subtle parallax on the outer card
            card.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

            rafRef.current = requestAnimationFrame(animate);
        };

        const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const x = e.clientX - cx;
            const y = e.clientY - cy;

            const normX = x / (rect.width / 2);
            const normY = y / (rect.height / 2);

            target.current.ry = normX * maxTilt; // rotateY follows X
            target.current.rx = -normY * maxTilt; // rotateX inversed Y
            target.current.tx = normX * maxShift; // subtle translate
            target.current.ty = normY * maxShift;
        };

        const onLeave = () => {
            target.current = { rx: 0, ry: 0, tx: 0, ty: 0 };
        };

        // Start anim loop
        rafRef.current = requestAnimationFrame(animate);

        // Listeners on the whole card area
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);

        // Touch devices: no tilt
        card.addEventListener("touchstart", onLeave, { passive: true });
        card.addEventListener("touchmove", onLeave, { passive: true });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
            card.removeEventListener("touchstart", onLeave);
            card.removeEventListener("touchmove", onLeave);
            // Clean transforms
            tilt.style.transform = "";
            card.style.transform = "";
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`group mt-4 rounded-lg w-fit mx-auto p-3 ring-1 ring-charcoal/10 transition-[transform,box-shadow] duration-300 will-change-transform hover:shadow-md perspective`}
            aria-label="Interactive QR card"
        >
            <div
                ref={tiltRef}
                className={`mx-auto w-full bg-cream rounded-md p-2 transition-[filter] duration-300 group-hover:brightness-[1.03] will-change-transform tilt`}
            >
                <QRCodeSVG
                    value="https://www.instagram.com/vietbites.to"
                    size={112}
                    bgColor="#fffaf0"
                    fgColor="#ea580c"
                    level="M"
                    className={`h-auto w-32 mx-auto qrDepth`}
                    aria-label="VietBites Instagram QR code"
                />
            </div>
        </div>
    );
}
