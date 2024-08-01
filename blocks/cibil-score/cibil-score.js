import {
    div, p, h2, select, option, label, input, button,
    span,
    img,
} from '../utils/dom-helper.js';

export default function decorate(block) {
    console.log(block)
    const innerdiv = block.querySelector(':scope > div');
    innerdiv.classList.add('cibil-score-parent')
    addInitialClassess(innerdiv)
    updateCibilScore(860, block)
}
function addInitialClassess(innerdiv) {
    const childDivs = innerdiv.querySelectorAll(":scope > div")
    childDivs.forEach((element, index) => {
        if (index == 0) {
            element.classList.add("cibil-score-content");
            addToolTipAndCibilScore(element, 860)
        } else {
            element.classList.add("cibil-score-meter");
            cibilMeter(element)
        }
    });
}
function addToolTipAndCibilScore(el, score) {
    const cibilScoreDiv = el.querySelectorAll('p')[1];
    cibilScoreDiv.appendChild(div({ class: 'cibil-score-info-container' },
        div({ class: 'score-container' }, span({ class: 'cibil-score-value' }, score)),
        div({ class: 'tooltip-container' },
            img({ class: 'info-btn-icon', src: '../../icons/iwithcircle.png', alt: 'i-icon' }),
            div({ class: 'score-info-container' },
                div({ class: 'score-info-content' },
                    div({ class: 'score-grade-content' },
                        span({ class: 'color excellent' }), span({ class: 'grade-text' }, 'Excellent'), span({ class: 'score-range' }, '800 - 900')
                    ),
                    div({ class: 'score-grade-content' },
                        span({ class: 'color very-good' }), span({ class: 'grade-text' }, 'Very Good'), span({ class: 'score-range' }, '750 - 799')
                    ),
                    div({ class: 'score-grade-content' },
                        span({ class: 'color good' }), span({ class: 'grade-text' }, 'Good'), span({ class: 'score-range' }, '670 - 749')
                    ),
                    div({ class: 'score-grade-content' },
                        span({ class: 'color average' }), span({ class: 'grade-text' }, 'Average'), span({ class: 'score-range' }, '580 - 669')
                    ),
                    div({ class: 'score-grade-content' },
                        span({ class: 'color poor' }), span({ class: 'grade-text' }, 'Poor'), span({ class: 'score-range' }, '300 - 579')
                    )
                ))
        )
    ))
}
function cibilMeter(el) {
    el.appendChild(
        div({ class: 'cibil-score-meter-container' }, div({ class: 'cibil-score-display' }, div({ class: 'cibil-score-meter-background' }, div({ class: 'cibil-score-meter-indicator' })), div({ class: 'cibil-score-value-container' }, span({ class: 'cibil-score-value' }), span({ class: 'cibil-score-grade' }))))
    )

}
function updateCibilScore(score, block) {
    const scoreElement = block.querySelector('.cibil-score-value-container .cibil-score-value');
    const indicatorElement = block.querySelector('.cibil-score-meter-indicator');
    const gradeEl = block.querySelector('.cibil-score-value-container .cibil-score-grade')
    scoreElement.textContent = score;
    const minScore = 300;
    const maxScore = 900;
    const rotationRange = 222.5;
    const scoreRange = maxScore - minScore;
    const targetRotationAngle = ((score - minScore) / scoreRange) * rotationRange;
    rotateIndicator(indicatorElement, 0, targetRotationAngle, minScore, score, gradeEl, scoreElement);
}



function rotateIndicator(indicatorElement, startAngle, targetAngle, minScore, score, gradeEl, scoreElement) {
    const duration = 2000;
    const startTime = performance.now();
    const maxScore = 900;
    const rotationRange = 245;
    const scoreRange = maxScore - minScore;

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentAngle = startAngle + (targetAngle * progress);
        const currentScore = Math.round(minScore + (currentAngle / rotationRange) * scoreRange);

        indicatorElement.style.transform = `rotate(${currentAngle + 4}deg)`;
        scoreElement.textContent = currentScore;
        addScoreGrade(currentScore, indicatorElement, gradeEl

        );
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            indicatorElement.style.transform = `rotate(${targetAngle}deg)`;
            scoreElement.textContent = score;
            addScoreGrade(score, indicatorElement, gradeEl);
        }
    }
    requestAnimationFrame(animate);
}

function addScoreGrade(score, meterIndicator, gradeEl) {
    const currentClasses = Array.from(meterIndicator.classList);
    currentClasses.forEach(className => {
        if (className !== 'cibil-score-meter-indicator') {
            meterIndicator.classList.remove(className);
        }
    });

    Array.from(gradeEl.classList).forEach(className => {
        if (className !== 'cibil-score-grade') {
            meterIndicator.classList.remove(className);
        }
    });
    if (score >= 300 && score < 600) {
        meterIndicator.classList.add('need_help');
        gradeEl.classList.add('need_help');
        gradeEl.textContent = "Need Help"
    }
    if (score >= 600 && score < 700) {
        meterIndicator.classList.add('average');
        gradeEl.classList.add('average');
        gradeEl.textContent = "Average"
    }
    if (score >= 700 && score < 760) {
        meterIndicator.classList.add('good');
        gradeEl.classList.add('good');
        gradeEl.textContent = "Good"
    }
    if (score >= 760 && score < 800) {
        meterIndicator.classList.add('very_good');
        gradeEl.classList.add('very_good');
        gradeEl.textContent = "Very Good"
    }
    if (score >= 800) {
        meterIndicator.classList.add('excellent');
        gradeEl.classList.add('excellent');
        gradeEl.textContent = "Excellent"
    }
}
