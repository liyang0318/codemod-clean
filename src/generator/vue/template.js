function generateTemplate(block) {
  return `<template>${block.content}</template>`;
}

module.exports = generateTemplate;
