import { generateSVGs, qS, qA } from './utils';
import './main.scss';
import svgs from './svgs';

generateSVGs(svgs);

document.addEventListener('DOMContentLoaded', function onLoad() {
    if (window.location.hash) {
        const activeSection = qS(window.location.hash);
        activeSection?.classList.add('active');
    }

    const sections = qA('#app > section')!;

    qA('section>h2').map((h2) => {
        h2.addEventListener('click', (e) => {
            const activeSection = (e.target as HTMLElement).closest('section')!;
            const nextActive = !activeSection.classList.contains('active');
            sections.forEach((section: HTMLElement) => section.classList.remove('active'));
            window.location.hash = nextActive ? activeSection.id : '';
            activeSection.classList.toggle('active', nextActive);
        });
    });

    return;
});
