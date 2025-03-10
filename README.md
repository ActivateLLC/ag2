<a name="readme-top"></a>

<p align="center">
  <!-- The image URL points to the GitHub-hosted content, ensuring it displays correctly on the PyPI website.-->
  <img src="https://raw.githubusercontent.com/ag2ai/ag2/27b37494a6f72b1f8050f6bd7be9a7ff232cf749/website/static/img/ag2.svg" width="150" title="hover text">
  <br>
  <br>
  <img src="https://img.shields.io/pypi/dm/pyautogen?label=PyPI%20downloads">
  <a href="https://badge.fury.io/py/autogen"><img src="https://badge.fury.io/py/autogen.svg"></a>
  <a href="https://github.com/ag2ai/ag2/actions/workflows/python-package.yml">
    <img src="https://github.com/ag2ai/ag2/actions/workflows/python-package.yml/badge.svg">
  </a>
  <img src="https://img.shields.io/badge/3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue">
  <a href="https://discord.gg/pAbnFJrkgZ">
    <img src="https://img.shields.io/discord/1153072414184452236?logo=discord&style=flat">
  </a>
  <a href="https://x.com/ag2oss">
    <img src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40ag2ai">
  </a>
</p>

<p align="center">
  <a href="https://docs.ag2.ai/">📚 Documentation</a> |
  <a href="https://github.com/ag2ai/build-with-ag2">💡 Examples</a> |
  <a href="https://docs.ag2.ai/docs/contributor-guide/contributing">🤝 Contributing</a> |
  <a href="#related-papers">📝 Cite paper</a> |
  <a href="https://discord.gg/pAbnFJrkgZ">💬 Join Discord</a>
</p>

<p align="center">
AG2 was evolved from AutoGen. Fully open-sourced. We invite collaborators from all organizations to contribute.
</p>

# Arise Cares Analytics Platform

This is a monorepo containing the Arise Cares caregiver quality metrics and marketing integration platform. The platform combines three powerful technologies:

1. **AG2** - Multi-agent AI framework for intelligent decision-making
2. **n8n** - Workflow automation platform (integrated via Docker)
3. **BrowserUse** - Web automation tool for real-time monitoring and interactions <!-- cspell:ignore BrowserUse -->

## Architecture

The platform uses a three-tier architecture:

- **Intelligence Layer** (AG2): Analyzes data, makes decisions, and provides recommendations
- **Workflow Layer** (n8n): Orchestrates processes, connects systems, and automates workflows
- **Automation Layer** (BrowserUse): Performs real-time web tasks, monitors competitive landscape, and executes actions <!-- cspell:ignore BrowserUse -->

For a detailed architecture diagram, see the [integrations README](integrations/README.md).

## Key Features

- **Caregiver Quality Metrics**
  - Performance tracking and peer comparison
  - Specialty care analytics (dementia, wound care, etc.)
  - Intervention success tracking
  - Personalized development recommendations

- **Marketing Integration**
  - Social proof analytics
  - Local SEO optimization
  - Competitor analysis
  - Automated content generation based on caregiver metrics

- **Automated Workflows**
  - SEO monitoring and improvement
  - Caregiver evaluation and training
  - Client feedback collection and analysis
  - Marketing campaign optimization

## Directory Structure

```
arise-cares-platform/
├── packages/             # Shared packages and modules
│   ├── common/           # Common utilities and types
│   ├── config/           # Configuration management
│   └── metrics-core/     # Core metrics processing logic
│
├── services/             # Core services
│   ├── ag2-agents/       # AG2 intelligent agents
│   ├── n8n-workflows/    # n8n workflow definitions
│   └── browser-automation/ # Browser automation scripts
│
├── integrations/         # Integration components
│   ├── docker-compose.yml # Docker configuration for n8n
│   ├── n8n.env           # Environment variables for n8n
│   ├── n8n_connector.py  # API connector for n8n
│   └── setup-n8n.sh      # Setup script for n8n
│
├── scripts/              # Development and deployment scripts
│
└── docker/               # Docker configurations
```

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- pnpm package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/activate/arise-cares-platform.git
cd arise-cares-platform
```

2. Run the setup script:
```bash
node scripts/setup/setup-all.js
```

3. Configure API keys in the `.env` file

4. Start n8n (using Docker):
```bash
cd integrations
docker-compose up -d
```

5. Start the n8n connector:
```bash
python integrations/n8n_connector.py
```

6. Run AG2 agents:
```bash
python -m autogen.main
```

## Implementation Plan

The system follows a 12-week rollout approach with four phases:

1. **Preparation and Setup** (Weeks 1-2)
2. **Initial Rollout** (Weeks 3-6)
3. **Expansion** (Weeks 7-10)
4. **Optimization and Expansion Planning** (Weeks 11-12)

## Contributing

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the proprietary license - see the [LICENSE](LICENSE) file for details.

# AG2: Open-Source AgentOS for AI Agents

AG2 (formerly AutoGen) is an open-source programming framework for building AI agents and facilitating cooperation among multiple agents to solve tasks. AG2 aims to streamline the development and research of AI agents. <!-- cspell:ignore agentic --> It offers features such as agents capable of interacting with each other, facilitates the use of various large language models (LLMs) and tool use support, autonomous and human-in-the-loop workflows, and multi-agent conversation patterns.

The project is currently maintained by a [dynamic group of volunteers](MAINTAINERS.md) from several organizations. Contact project administrators Chi Wang and Wu Qingyun via [support@ag2.ai](mailto:support@ag2.ai) if you are interested in becoming a maintainer. <!-- cspell:ignore Qingyun -->

## Table of contents

- [AG2: Open-Source AgentOS for AI Agents](#ag2-open-source-agentos-for-ai-agents)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Installation](#installation)
    - [n8n Workflow Automation Integration](#n8n-workflow-automation-integration)
    - [Setup your API keys](#setup-your-api-keys)
    - [Run your first agent](#run-your-first-agent)
  - [Example applications](#example-applications)
  - [Introduction of different agent concepts](#introduction-of-different-agent-concepts)
    - [Conversable agent](#conversable-agent)
    - [Human in the loop](#human-in-the-loop)
    - [Orchestrating multiple agents](#orchestrating-multiple-agents)
    - [Tools](#tools)
    - [Advanced agentic design patterns](#advanced-agentic-design-patterns)
  - [Announcements](#announcements)
  - [Contributors Wall](#contributors-wall)
  - [Code style and linting](#code-style-and-linting)
  - [Related papers](#related-papers)
  - [Cite the project](#cite-the-project)
  - [License](#license)
  - [Marketing Automation Agents](#marketing-automation-agents)

## Getting started

For a step-by-step walk through of AG2 concepts and code, see [Basic Concepts](https://docs.ag2.ai/docs/user-guide/basic-concepts) in our documentation.

### Installation

AG2 requires **Python version >= 3.9, < 3.14**. AG2 is available via `ag2` (or its alias `pyautogen` or `autogen`) on PyPI.

```bash
pip install ag2[openai]
```

Minimal dependencies are installed by default. You can install extra options based on the features you need.

### n8n Workflow Automation Integration

This project includes integration with [n8n](https://n8n.io), a powerful workflow automation platform that complements our caregiver analytics system. n8n provides a visual interface for creating workflows that connect our APIs, data sources, and marketing tools.

#### Setting up n8n

1. Make sure you have Docker installed on your system
2. Run the setup script:

```bash
cd integrations
./setup-n8n.sh
```

3. Start n8n:

```bash
cd integrations
docker-compose up -d
```

4. Access the n8n editor at http://localhost:5678

#### Key Features

- Visual workflow builder for caregiver metrics collection and analysis
- Automated marketing campaigns based on quality metrics
- Integration with SEO tools, social media platforms, and CRMs
- Scheduled reports and notifications for stakeholders
- No-code interface for business users to create custom workflows

### Setup your API keys

To keep your LLM dependencies neat we recommend using the `OAI_CONFIG_LIST` file to store your API keys.

You can use the sample file `OAI_CONFIG_LIST_sample` as a template.

```json
[
  {
    "model": "gpt-4o",
    "api_key": "<your OpenAI API key here>"
  }
]
```

### Run your first agent

Create a script or a Jupyter Notebook and run your first agent.

```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

llm_config = {
    "config_list": config_list_from_json(env_or_file="OAI_CONFIG_LIST")
}

assistant = AssistantAgent("assistant", llm_config=llm_config)
user_proxy = UserProxyAgent("user_proxy", code_execution_config={"work_dir": "coding", "use_docker": False})
user_proxy.initiate_chat(assistant, message="Plot a chart of NVDA and TESLA stock price change YTD.")
# This initiates an automated chat between the two agents to solve the task
```

## Example applications

We maintain a dedicated repository with a wide range of applications to help you get started with various use cases or check out our collection of jupyter notebooks as a starting point.

- [Build with AG2](https://github.com/ag2ai/build-with-ag2)
- [Jupyter Notebooks](notebook)

## Introduction of different agent concepts

We have several agent concepts in AG2 to help you build your AI agents. We introduce the most common ones here.

- **Conversable Agent**: Agents that are able to send messages, receive messages and generate replies using GenAI models, non-GenAI tools, or human inputs.
- **Human in the loop**: Add human input to the conversation
- **Orchestrating multiple agents**: Users can orchestrate multiple agents with built-in conversation patterns such as group chats, nested chats, sequential chats or customize the orchestration by registering custom reply methods.
- **Tools**: Programs that can be registered, invoked and executed by agents
- **Advanced Concepts**: AG2 supports more concepts such as structured outputs, rag, code execution, etc.

### Conversable agent

The conversable agent is the most used agent and is created for generating conversations among agents.
It serves as a base class for all agents in AG2.

```python
from autogen import ConversableAgent

# Create an AI agent
assistant = ConversableAgent(
    name="assistant",
    system_message="You are an assistant that responds concisely.",
    llm_config=llm_config
)

# Create another AI agent
fact_checker = ConversableAgent(
    name="fact_checker",
    system_message="You are a fact-checking assistant.",
    llm_config=llm_config
)

# Start the conversation
assistant.initiate_chat(
    recipient=fact_checker,
    message="What is AG2?",
    max_turns=2
)
```

### Human in the loop

Sometimes your wished workflow requires human input. Therefore you can enable the human in the loop feature.

If you set `human_input_mode` to `ALWAYS` on ConversableAgent you can give human input to the conversation.

There are three modes for `human_input_mode`: `ALWAYS`, `NEVER`, `TERMINATE`.

We created a class which sets the `human_input_mode` to `ALWAYS` for you. Its called `UserProxyAgent`.

```python
from autogen import ConversableAgent

# Create an AI agent
assistant = ConversableAgent(
    name="assistant",
    system_message="You are a helpful assistant.",
    llm_config=llm_config
)

# Create a human agent with manual input mode
human = ConversableAgent(
    name="human",
    human_input_mode="ALWAYS"
)
# or
human = UserProxyAgent(name="human", code_execution_config={"work_dir": "coding", "use_docker": False})

# Start the chat
human.initiate_chat(
    recipient=assistant,
    message="Hello! What's 2 + 2?"
)

```

### Orchestrating multiple agents

Users can define their own orchestration patterns using the flexible programming interface from AG2.

Additionally AG2 provides multiple built-in patterns to orchestrate multiple agents, such as `GroupChat` and `Swarm`.

Both concepts are used to orchestrate multiple agents to solve a task.

The group chat works like a chat where each registered agent can participate in the conversation.

```python
from autogen import ConversableAgent, GroupChat, GroupChatManager

# Create AI agents
teacher = ConversableAgent(name="teacher", system_message="You suggest lesson topics.")
planner = ConversableAgent(name="planner", system_message="You create lesson plans.")
reviewer = ConversableAgent(name="reviewer", system_message="You review lesson plans.")

# Create GroupChat
groupchat = GroupChat(agents=[teacher, planner, reviewer], speaker_selection_method="auto")

# Create the GroupChatManager, it will manage the conversation and uses an LLM to select the next agent
manager = GroupChatManager(name="manager", groupchat=groupchat)

# Start the conversation
teacher.initiate_chat(manager, "Create a lesson on photosynthesis.")
```

The swarm requires a more rigid structure and the flow needs to be defined with hand-off, post-tool, and post-work transitions from an agent to another agent.

Read more about it in the [documentation](https://docs.ag2.ai/docs/user-guide/advanced-concepts/conversation-patterns-deep-dive)

### Tools

Agents gain significant utility through tools as they provide access to external data, APIs, and functionality.

```python
from datetime import datetime
from typing import Annotated

from autogen import ConversableAgent, register_function

# 1. Our tool, returns the day of the week for a given date
def get_weekday(date_string: Annotated[str, "Format: YYYY-MM-DD"]) -> str:
    date = datetime.strptime(date_string, "%Y-%m-%d")
    return date.strftime("%A")

# 2. Agent for determining whether to run the tool
date_agent = ConversableAgent(
    name="date_agent",
    system_message="You get the day of the week for a given date.",
    llm_config=llm_config,
)

# 3. And an agent for executing the tool
executor_agent = ConversableAgent(
    name="executor_agent",
    human_input_mode="NEVER",
)

# 4. Registers the tool with the agents, the description will be used by the LLM
register_function(
    get_weekday,
    caller=date_agent,
    executor=executor_agent,
    description="Get the day of the week for a given date",
)

# 5. Two-way chat ensures the executor agent follows the suggesting agent
chat_result = executor_agent.initiate_chat(
    recipient=date_agent,
    message="I was born on the 25th of March 1995, what day was it?",
    max_turns=1,
)
```

### Advanced agentic design patterns

AG2 supports more advanced concepts to help you build your AI agent workflows. You can find more information in the documentation.

- [Structured Output](https://docs.ag2.ai/docs/user-guide/basic-concepts/structured-outputs)
- [Ending a conversation](https://docs.ag2.ai/docs/user-guide/basic-concepts/ending-a-chat)
- [Retrieval Augmented Generation (RAG)](https://docs.ag2.ai/docs/user-guide/advanced-concepts/rag)
- [Code Execution](https://docs.ag2.ai/docs/user-guide/advanced-concepts/code-execution)
- [Tools with Secrets](https://docs.ag2.ai/docs/user-guide/advanced-concepts/tools-with-secrets)

## Marketing Automation Agents

AG2 now includes a suite of marketing automation agents designed to streamline SEO, content strategy, and marketing campaign management:

### SEO Audit Agent
- Performs comprehensive technical SEO audits
- Analyzes Core Web Vitals metrics
- Checks security configurations and mobile optimization
- Generates detailed reports with actionable insights

### Content Strategy Agent
- Analyzes competitor content and identifies opportunities
- Performs keyword research and gap analysis
- Provides content optimization recommendations
- Tracks content performance metrics

### Marketing Automation Agent
- Automates campaign scheduling across multiple platforms
- Manages social media post scheduling
- Sets up tracking and analytics
- Implements automation rules for campaign optimization

### Usage Example

```python
from autogen import SEOAuditAgent, ContentStrategyAgent, MarketingAutomationAgent

# Initialize agents
seo_agent = SEOAuditAgent()
content_agent = ContentStrategyAgent()
marketing_agent = MarketingAutomationAgent()

# Run SEO audit
audit_results = await seo_agent.run_audit(
    url="https://example.com",
    api_keys={
        "google": "your_key",
        "pagespeed": "your_key"
    }
)

# Analyze content strategy
content_analysis = await content_agent.analyze_content(
    target_url="https://example.com",
    competitors=["competitor1.com", "competitor2.com"],
    api_keys={
        "ahrefs": "your_key",
        "semrush": "your_key"
    }
)

# Schedule marketing campaign
campaign_config = {
    "name": "Q1 Campaign",
    "platforms": ["facebook", "twitter"],
    "content": [
        {
            "text": "Check out our latest features!",
            "media": ["image.jpg"],
            "schedule": "2025-03-01T12:00:00Z"
        }
    ]
}

campaign_results = await marketing_agent.schedule_campaign(
    campaign_config=campaign_config,
    platform_tokens={
        "facebook": "your_token",
        "twitter": "your_token"
    }
)
```

For more detailed documentation and examples, visit our [Marketing Automation Guide](docs/marketing_automation.md).

## Announcements

🔥 🎉 **Nov 11, 2024:** We are evolving AutoGen into **AG2**!
A new organization [AG2AI](https://github.com/ag2ai) is created to host the development of AG2 and related projects with open governance. Check [AG2's new look](https://ag2.ai/).

📄 **License:**
We adopt the Apache 2.0 license from v0.3. This enhances our commitment to open-source collaboration while providing additional protections for contributors and users alike.

🎉 May 29, 2024: DeepLearning.ai launched a new short course [AI Agentic Design Patterns with AutoGen](https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen), made in collaboration with Microsoft and Penn State University, and taught by AutoGen creators [Chi Wang](https://github.com/sonichi) and [Qingyun Wu](https://github.com/qingyun-wu).

🎉 May 24, 2024: Foundation Capital published an article on [Forbes: The Promise of Multi-Agent AI](https://www.forbes.com/sites/joannechen/2024/05/24/the-promise-of-multi-agent-ai/?sh=2c1e4f454d97) and a video [AI in the Real World Episode 2: Exploring Multi-Agent AI and AutoGen with Chi Wang](https://www.youtube.com/watch?v=RLwyXRVvlNk).

🎉 Apr 17, 2024: Andrew Ng cited AutoGen in [The Batch newsletter](https://www.deeplearning.ai/the-batch/issue-245/) and [What's next for AI agentic workflows](https://youtu.be/sal78ACtGTc?si=JduUzN_1kDnMq0vF) at Sequoia Capital's AI Ascent (Mar 26).

[More Announcements](announcements.md)

## Contributors Wall

<a href="https://github.com/ag2ai/ag2/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ag2ai/ag2&max=204" />
</a>

## Code style and linting

This project uses pre-commit hooks to maintain code quality. Before contributing:

1. Install pre-commit:

```bash
pip install pre-commit
pre-commit install
```

2. The hooks will run automatically on commit, or you can run them manually:

```bash
pre-commit run --all-files
```

## Related papers

- [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)

- [EcoOptiGen: Hyperparameter Optimization for Large Language Model Generation Inference](https://arxiv.org/abs/2303.04673)

- [MathChat: Converse to Tackle Challenging Math Problems with LLM Agents](https://arxiv.org/abs/2306.01337)

- [AgentOptimizer: Offline Training of Language Model Agents with Functions as Learnable Weights](https://arxiv.org/pdf/2402.11359)

- [StateFlow: Enhancing LLM Task-Solving through State-Driven Workflows](https://arxiv.org/abs/2403.11322)

## Cite the project

```
@software{AG2_2024,
author = {Chi Wang and Qingyun Wu and the AG2 Community},
title = {AG2: Open-Source AgentOS for AI Agents},
year = {2024},
url = {https://github.com/ag2ai/ag2},
note = {Available at https://docs.ag2.ai/},
version = {latest}
}
```

## License

This project is licensed under the [Apache License, Version 2.0 (Apache-2.0)](./LICENSE).

This project is a spin-off of [AutoGen](https://github.com/microsoft/autogen) and contains code under two licenses:

- The original code from https://github.com/microsoft/autogen is licensed under the MIT License. See the [LICENSE_original_MIT](./license_original/LICENSE_original_MIT) file for details.

- Modifications and additions made in this fork are licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for the full license text.

We have documented these changes for clarity and to ensure transparency with our user and contributor community. For more details, please see the [NOTICE](./NOTICE.md) file.
