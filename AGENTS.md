# Smart Grocery AI Store — Agent Usage Guide

This project uses AI agents from [agency-agents](https://github.com/msitarzewski/agency-agents) 
via OpenCode's subagent system. Activate any agent with `@agent-name`.

## Available Agents

### Engineering (Core Team)
| Agent | When to Use |
|-------|-------------|
| `@frontend-developer` | UI implementation, performance optimization, component refactoring |
| `@backend-architect` | API design, database architecture, Laravel service layer |
| `@codebase-onboarding-engineer` | New team member onboarding, codebase exploration |
| `@senior-developer` | Complex implementations, advanced patterns, Laravel/Livewire |
| `@code-reviewer` | PR reviews, code quality gates, security review |
| `@software-architect` | Architecture decisions, trade-off analysis, system design |
| `@ai-engineer` | AI integration, LLM features, Gemini/OpenAI integration |
| `@multiagent-systems-architect` | Multi-agent pipeline design, agent coordination |
| `@database-optimizer` | Schema design, query optimization, indexing |
| `@devops-automator` | CI/CD, deployment, Docker, infrastructure |
| `@prompt-engineer` | LLM prompt design and optimization |
| `@minimal-change-engineer` | Minimum-viable diffs — fix only what's asked |

### Testing & QA
| Agent | When to Use |
|-------|-------------|
| `@api-tester` | API validation, endpoint testing |
| `@reality-checker` | Production readiness, quality gates |
| `@evidence-collector` | Screenshot-based QA, visual verification |
| `@performance-benchmarker` | Load testing, performance optimization |

### Security
| Agent | When to Use |
|-------|-------------|
| `@security-architect` | Threat modeling, system security review |
| `@application-security-engineer` | Code-level vulnerability scanning |

### Design
| Agent | When to Use |
|-------|-------------|
| `@ui-designer` | Visual design, component polish |
| `@ux-architect` | Layout structure, CSS systems |

## Workflow

```
1. Pick a task from the roadmap
2. Activate relevant agent: @agent-name
3. Agent provides specialized workflow + code
4. Review via @code-reviewer
5. Mark complete
```

## Agent Locations

- Source agents: `D:\laragon\www\agency-agents\`
- OpenCode agents: `.opencode/agents/`
- To add more agents: run convert from agency-agents root
