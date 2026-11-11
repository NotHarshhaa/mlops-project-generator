"use client"

import {
  PYTHON_VERSION_OPTIONS,
  ENV_MANAGER_OPTIONS,
  LICENSE_OPTIONS,
  CI_PROVIDER_OPTIONS,
} from "../constants"
import { CustomSelectField } from "../fields/CustomSelectField"
import { SectionHeader } from "../ui"

export function RuntimeGovernance() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader
        title="Runtime Environment & Governance"
        subtitle="Python version, package manager, software license, and CI/CD automation manifests."
        step="LAYER 05 // RUNTIME & GOVERNANCE"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="python_version"
          label="Python Runtime"
          description="Target CPython interpreter version"
          options={PYTHON_VERSION_OPTIONS}
          placeholder="Select Python version…"
        />
        <CustomSelectField
          name="env_manager"
          label="Dependency Manager"
          description="Environment resolver (UV, Poetry, Pip, Conda)"
          options={ENV_MANAGER_OPTIONS}
          placeholder="Select package manager…"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelectField
          name="license"
          label="Open Source License"
          description="Software license stamped into LICENSE and pyproject.toml"
          options={LICENSE_OPTIONS}
          placeholder="Select license…"
        />
        <CustomSelectField
          name="ci_provider"
          label="CI/CD Automation Target"
          description="Continuous integration workflow template"
          options={CI_PROVIDER_OPTIONS}
          placeholder="Select CI/CD provider…"
        />
      </div>
    </div>
  )
}
