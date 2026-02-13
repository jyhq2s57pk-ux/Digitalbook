#!/usr/bin/env npx tsx

/**
 * Validate all content JSON files against expected schemas.
 *
 * Usage:
 *   npx tsx scripts/validate-content.ts
 *   npm run validate
 *
 * Checks:
 *   - All edition.json files have required fields
 *   - All section.json files have required fields
 *   - All feature JSON files have required fields
 *   - Feature status values are valid
 *   - Referenced images exist in public/
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const VALID_STATUSES = ['go-live', 'set-up-required', 'sub-region-request', 'content-go-live-ongoing'];

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];
let totalEditions = 0;
let totalSections = 0;
let totalFeatures = 0;

function addError(file: string, message: string) {
  errors.push({ file, message });
}

function addWarning(file: string, message: string) {
  warnings.push({ file, message });
}

function validateEdition(editionDir: string, slug: string) {
  const editionFile = join(editionDir, 'edition.json');

  if (!existsSync(editionFile)) {
    addError(editionFile, 'edition.json is missing');
    return;
  }

  try {
    const data = JSON.parse(readFileSync(editionFile, 'utf-8'));

    if (!data.title) addError(editionFile, 'Missing "title" field');
    if (!data.date) addError(editionFile, 'Missing "date" field');
    if (!data.intro) addWarning(editionFile, 'Missing "intro" field');

    totalEditions++;
  } catch (e) {
    addError(editionFile, `Invalid JSON: ${(e as Error).message}`);
  }
}

function validateSection(sectionDir: string, editionSlug: string) {
  const sectionFile = join(sectionDir, 'section.json');

  if (!existsSync(sectionFile)) {
    addError(sectionFile, 'section.json is missing');
    return;
  }

  try {
    const data = JSON.parse(readFileSync(sectionFile, 'utf-8'));

    if (!data.title) addError(sectionFile, 'Missing "title" field');
    if (!data.color) addError(sectionFile, 'Missing "color" field');
    if (data.order === undefined) addError(sectionFile, 'Missing "order" field');

    totalSections++;
  } catch (e) {
    addError(sectionFile, `Invalid JSON: ${(e as Error).message}`);
  }

  // Validate features
  const featuresDir = join(sectionDir, 'features');
  if (existsSync(featuresDir)) {
    const featureFiles = readdirSync(featuresDir).filter((f) => f.endsWith('.json'));
    for (const featureFile of featureFiles) {
      validateFeature(join(featuresDir, featureFile), editionSlug);
    }
  }
}

function validateFeature(featureFile: string, editionSlug: string) {
  try {
    const data = JSON.parse(readFileSync(featureFile, 'utf-8'));

    // Required fields
    if (!data.slug) addError(featureFile, 'Missing "slug" field');
    if (!data.title) addError(featureFile, 'Missing "title" field');
    if (!data.status) {
      addError(featureFile, 'Missing "status" field');
    } else if (!VALID_STATUSES.includes(data.status)) {
      addError(featureFile, `Invalid status "${data.status}". Must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    if (!data.goal) addWarning(featureFile, 'Missing "goal" field');
    if (!data.description) addWarning(featureFile, 'Missing "description" field');

    // Validate arrays
    if (!Array.isArray(data.tags)) addWarning(featureFile, '"tags" should be an array');
    if (!Array.isArray(data.regions)) addWarning(featureFile, '"regions" should be an array');
    if (!Array.isArray(data.platforms)) addWarning(featureFile, '"platforms" should be an array');
    if (!Array.isArray(data.images)) addWarning(featureFile, '"images" should be an array');

    // Validate image paths exist
    if (Array.isArray(data.images)) {
      const projectRoot = join(import.meta.dirname || __dirname, '..');
      for (const imagePath of data.images) {
        const fullPath = join(projectRoot, 'public', imagePath);
        if (!existsSync(fullPath)) {
          addWarning(featureFile, `Image not found: ${imagePath} (expected at public/${imagePath})`);
        }
      }
    }

    totalFeatures++;
  } catch (e) {
    addError(featureFile, `Invalid JSON: ${(e as Error).message}`);
  }
}

function main() {
  const projectRoot = join(import.meta.dirname || __dirname, '..');
  const editionsDir = join(projectRoot, 'content', 'editions');

  if (!existsSync(editionsDir)) {
    console.error('❌ content/editions/ directory not found');
    process.exit(1);
  }

  console.log('\n🔍 Validating content...\n');

  const editions = readdirSync(editionsDir).filter((name) => {
    return statSync(join(editionsDir, name)).isDirectory();
  });

  for (const editionSlug of editions) {
    const editionDir = join(editionsDir, editionSlug);
    validateEdition(editionDir, editionSlug);

    // Find section directories
    const items = readdirSync(editionDir);
    for (const item of items) {
      const itemPath = join(editionDir, item);
      if (statSync(itemPath).isDirectory()) {
        validateSection(itemPath, editionSlug);
      }
    }
  }

  // Report
  console.log(`📊 Summary:`);
  console.log(`   Editions:  ${totalEditions}`);
  console.log(`   Sections:  ${totalSections}`);
  console.log(`   Features:  ${totalFeatures}\n`);

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s):`);
    for (const w of warnings) {
      console.log(`   ${w.file}: ${w.message}`);
    }
    console.log();
  }

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} error(s):`);
    for (const e of errors) {
      console.log(`   ${e.file}: ${e.message}`);
    }
    console.log();
    process.exit(1);
  } else {
    console.log(`✅ All content is valid!\n`);
  }
}

main();
