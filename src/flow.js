export function isStepVisible(step, answers) {
  if (!step.when) return true;
  const actual = answers[step.when.field];
  const values = Array.isArray(actual) ? actual : [actual];
  if (step.when.includes) return values.includes(step.when.includes);
  if (step.when.oneOf) return step.when.oneOf.some((value) => values.includes(value));
  return true;
}

export function visibleSteps(steps, answers) {
  return steps.filter((step) => isStepVisible(step, answers));
}

export function estimateProject(flowKey, answers) {
  const base = { newSite: 65000, improve: 35000, promotion: 30000 }[flowKey] || 25000;
  let total = base;
  const selected = Object.values(answers).flatMap((value) => Array.isArray(value) ? value : [value]);
  const extras = ['Оплата на сайте', 'Расчёт доставки', 'Учёт остатков', 'Личный кабинет', 'Калькулятор', 'Перенос сайта', 'Две разные страницы'];
  total += extras.filter((item) => selected.includes(item)).length * 15000;
  if (selected.includes('1 000–10 000') || selected.includes('Более 10 000')) total += 30000;
  if (selected.includes('Полный индивидуальный дизайн + логотип')) total += 25000;
  return { from: total, to: Math.round(total * 1.35 / 5000) * 5000 };
}

export function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}
