# -*- coding: utf-8 -*-
# Documentation page generator - reads Chinese from source files
# All Chinese strings use \uXXXX unicode escapes for ASCII safety

import re
import os
import sys

BASE = r'd:\codespace\mcst\easybuild'
DOC_DIR = os.path.join(BASE, 'doc', '\u5f00\u53d1\u6587\u6863')
READER_DIR = os.path.join(BASE, 'front', 'src', 'app', 'docs', 'reader')
CORE_PATH = os.path.join(READER_DIR, 'core', 'page.tsx')

# Common sidebar/tab Chinese strings read from core at runtime
# Page configs: slug, md_file, active_label, export_name, breadcrumb, title, subtitle,
#               prev_label, prev_href, next_label, next_href, footer

PAGES = [
    {
        'slug': 'web-prd',
        'md': 'web-prd\u5f00\u53d1\u624b\u518c.md',
        'active': 'Web \u5e94\u7528',
        'export': 'WebPrdDocPage',
        'breadcrumb': 'Web \u5e94\u7528',
        'title': 'easyfk-web-prd Web \u5e94\u7528',
        'subtitle': 'Web \u5e94\u7528\u5f00\u53d1 \u2014 \u4f01\u4e1a\u7ea7 Web \u57fa\u7840\u8bbe\u65bd',
        'prev_label': '\u7f51\u5173', 'prev_href': '/docs/reader/gateway',
        'next_label': '\u5fae\u670d\u52a1 Web', 'next_href': '/docs/reader/web-micro',
        'footer': 'easyfk-web-prd \u2014 \u4f01\u4e1a\u7ea7 Web \u5e94\u7528\u57fa\u7840\u8bbe\u65bd\u3002',
    },
    {
        'slug': 'web-micro',
        'md': 'web-micro\u5f00\u53d1\u624b\u518c.md',
        'active': '\u5fae\u670d\u52a1 Web',
        'export': 'WebMicroDocPage',
        'breadcrumb': '\u5fae\u670d\u52a1 Web',
        'title': 'easyfk-web-micro \u5fae\u670d\u52a1 Web',
        'subtitle': '\u5fae\u670d\u52a1 Web \u5f00\u53d1 \u2014 \u8f7b\u91cf\u7ea7\u5fae\u670d\u52a1 Web \u652f\u6491',
        'prev_label': 'Web \u5e94\u7528', 'prev_href': '/docs/reader/web-prd',
        'next_label': 'WebSocket', 'next_href': '/docs/reader/websocket',
        'footer': 'easyfk-web-micro \u2014 \u8f7b\u91cf\u7ea7\u5fae\u670d\u52a1 Web \u57fa\u7840\u8bbe\u65bd\u3002',
    },
    {
        'slug': 'websocket',
        'md': 'websocket\u5f00\u53d1\u6587\u6863.md',
        'active': 'WebSocket',
        'export': 'WebSocketDocPage',
        'breadcrumb': 'WebSocket',
        'title': 'easyfk-websocket WebSocket',
        'subtitle': 'WebSocket \u901a\u4fe1 \u2014 \u5b9e\u65f6\u53cc\u5411\u6d88\u606f\u63a8\u9001',
        'prev_label': '\u5fae\u670d\u52a1 Web', 'prev_href': '/docs/reader/web-micro',
        'next_label': 'Hibernate', 'next_href': '/docs/reader/orm-hibernate',
        'footer': 'easyfk-websocket \u2014 \u5b9e\u65f6\u53cc\u5411\u901a\u4fe1\uff0c\u6784\u5efa\u9ad8\u6548\u6d88\u606f\u63a8\u9001\u80fd\u529b\u3002',
    },
    {
        'slug': 'orm-hibernate',
        'md': 'orm-hibernate\u5f00\u53d1\u624b\u518c.md',
        'active': 'Hibernate',
        'export': 'OrmHibernateDocPage',
        'breadcrumb': 'Hibernate',
        'title': 'easyfk-orm-hibernate Hibernate',
        'subtitle': 'Hibernate ORM \u2014 JPA \u6570\u636e\u6301\u4e45\u5316',
        'prev_label': 'WebSocket', 'prev_href': '/docs/reader/websocket',
        'next_label': 'MyBatis', 'next_href': '/docs/reader/orm-mybatis',
        'footer': 'easyfk-orm-hibernate \u2014 JPA \u6807\u51c6\u6570\u636e\u6301\u4e45\u5316\u65b9\u6848\u3002',
    },
    {
        'slug': 'orm-mybatis',
        'md': 'orm-mybatis\u5f00\u53d1\u624b\u518c.md',
        'active': 'MyBatis',
        'export': 'OrmMybatisDocPage',
        'breadcrumb': 'MyBatis',
        'title': 'easyfk-orm-mybatis MyBatis',
        'subtitle': 'MyBatis \u96c6\u6210 \u2014 \u7075\u6d3b\u7684 SQL \u6620\u5c04\u6846\u67b6',
        'prev_label': 'Hibernate', 'prev_href': '/docs/reader/orm-hibernate',
        'next_label': 'MyBatis-Flex', 'next_href': '/docs/reader/orm-flex',
        'footer': 'easyfk-orm-mybatis \u2014 \u7075\u6d3b\u9ad8\u6548\u7684 SQL \u6620\u5c04\u6570\u636e\u8bbf\u95ee\u5c42\u3002',
    },
    {
        'slug': 'orm-flex',
        'md': 'orm-flex\u5f00\u53d1\u624b\u518c.md',
        'active': 'MyBatis-Flex',
        'export': 'OrmFlexDocPage',
        'breadcrumb': 'MyBatis-Flex',
        'title': 'easyfk-orm-flex MyBatis-Flex',
        'subtitle': 'MyBatis-Flex \u2014 \u4f18\u96c5\u7684 MyBatis \u589e\u5f3a\u6846\u67b6',
        'prev_label': 'MyBatis', 'prev_href': '/docs/reader/orm-mybatis',
        'next_label': 'ShardingSphere', 'next_href': '/docs/reader/orm-sharding',
        'footer': 'easyfk-orm-flex \u2014 \u4f18\u96c5\u7684 MyBatis \u589e\u5f3a\uff0c\u6781\u7b80 CRUD \u5f00\u53d1\u4f53\u9a8c\u3002',
    },
    {
        'slug': 'orm-sharding',
        'md': 'orm-sharding\u5f00\u53d1\u624b\u518c.md',
        'active': 'ShardingSphere',
        'export': 'OrmShardingDocPage',
        'breadcrumb': 'ShardingSphere',
        'title': 'easyfk-orm-sharding ShardingSphere',
        'subtitle': 'ShardingSphere \u2014 \u5206\u5e93\u5206\u8868\u4e0e\u8bfb\u5199\u5206\u79bb',
        'prev_label': 'MyBatis-Flex', 'prev_href': '/docs/reader/orm-flex',
        'next_label': 'Redis', 'next_href': '/docs/reader/db-redis',
        'footer': 'easyfk-orm-sharding \u2014 \u5206\u5e93\u5206\u8868\u4e0e\u8bfb\u5199\u5206\u79bb\uff0c\u6784\u5efa\u5f39\u6027\u6570\u636e\u67b6\u6784\u3002',
    },
    {
        'slug': 'db-redis',
        'md': 'db-redis\u5f00\u53d1\u624b\u518c.md',
        'active': 'Redis',
        'active_group': '\u6570\u636e\u5e93',
        'export': 'DbRedisDocPage',
        'breadcrumb': 'Redis',
        'title': 'easyfk-db-redis Redis',
        'subtitle': 'Redis \u6570\u636e\u5e93 \u2014 \u9ad8\u6027\u80fd\u952e\u503c\u5b58\u50a8',
        'prev_label': 'ShardingSphere', 'prev_href': '/docs/reader/orm-sharding',
        'next_label': 'MongoDB', 'next_href': '/docs/reader/db-mongo',
        'footer': 'easyfk-db-redis \u2014 \u9ad8\u6027\u80fd Redis \u952e\u503c\u5b58\u50a8\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'db-mongo',
        'md': 'db-mongo\u5f00\u53d1\u624b\u518c.md',
        'active': 'MongoDB',
        'export': 'DbMongoDocPage',
        'breadcrumb': 'MongoDB',
        'title': 'easyfk-db-mongo MongoDB',
        'subtitle': 'MongoDB \u2014 \u6587\u6863\u578b NoSQL \u6570\u636e\u5e93',
        'prev_label': 'Redis', 'prev_href': '/docs/reader/db-redis',
        'next_label': 'ClickHouse', 'next_href': '/docs/reader/db-clickhouse',
        'footer': 'easyfk-db-mongo \u2014 \u6587\u6863\u578b NoSQL \u6570\u636e\u5e93\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'db-clickhouse',
        'md': 'db-clickhouse\u5f00\u53d1\u624b\u518c.md',
        'active': 'ClickHouse',
        'export': 'DbClickhouseDocPage',
        'breadcrumb': 'ClickHouse',
        'title': 'easyfk-db-clickhouse ClickHouse',
        'subtitle': 'ClickHouse \u2014 \u9ad8\u6027\u80fd\u5217\u5f0f\u5206\u6790\u6570\u636e\u5e93',
        'prev_label': 'MongoDB', 'prev_href': '/docs/reader/db-mongo',
        'next_label': 'Caffeine \u7f13\u5b58', 'next_href': '/docs/reader/cache-caffeine',
        'footer': 'easyfk-db-clickhouse \u2014 \u9ad8\u6027\u80fd\u5217\u5f0f\u5206\u6790\u6570\u636e\u5e93\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'mq-rocket',
        'md': 'mq-rocket\u5f00\u53d1\u624b\u518c.md',
        'active': 'RocketMQ',
        'export': 'MqRocketDocPage',
        'breadcrumb': 'RocketMQ',
        'title': 'easyfk-mq-rocket RocketMQ',
        'subtitle': 'RocketMQ \u6d88\u606f\u961f\u5217 \u2014 \u9ad8\u53ef\u9760\u5206\u5e03\u5f0f\u6d88\u606f',
        'prev_label': 'Redis \u81ea\u589eID', 'prev_href': '/docs/reader/autoid-redis',
        'next_label': 'RabbitMQ', 'next_href': '/docs/reader/mq-rabbit',
        'footer': 'easyfk-mq-rocket \u2014 \u9ad8\u53ef\u9760\u5206\u5e03\u5f0f\u6d88\u606f\u961f\u5217\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'mq-rabbit',
        'md': 'mq-rabbit\u5f00\u53d1\u624b\u518c.md',
        'active': 'RabbitMQ',
        'export': 'MqRabbitDocPage',
        'breadcrumb': 'RabbitMQ',
        'title': 'easyfk-mq-rabbit RabbitMQ',
        'subtitle': 'RabbitMQ \u6d88\u606f\u961f\u5217 \u2014 \u8f7b\u91cf\u7ea7\u6d88\u606f\u4e2d\u95f4\u4ef6',
        'prev_label': 'RocketMQ', 'prev_href': '/docs/reader/mq-rocket',
        'next_label': 'Kafka', 'next_href': '/docs/reader/mq-kafka',
        'footer': 'easyfk-mq-rabbit \u2014 \u8f7b\u91cf\u7ea7\u6d88\u606f\u4e2d\u95f4\u4ef6\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'mq-kafka',
        'md': 'mq-kafka\u5f00\u53d1\u624b\u518c.md',
        'active': 'Kafka',
        'export': 'MqKafkaDocPage',
        'breadcrumb': 'Kafka',
        'title': 'easyfk-mq-kafka Kafka',
        'subtitle': 'Kafka \u6d88\u606f\u961f\u5217 \u2014 \u9ad8\u541e\u5410\u6d41\u5f0f\u6570\u636e\u5e73\u53f0',
        'prev_label': 'RabbitMQ', 'prev_href': '/docs/reader/mq-rabbit',
        'next_label': 'Dubbo', 'next_href': '/docs/reader/rpc-dubbo',
        'footer': 'easyfk-mq-kafka \u2014 \u9ad8\u541e\u5410\u6d41\u5f0f\u6570\u636e\u5e73\u53f0\u96c6\u6210\u65b9\u6848\u3002',
    },
    {
        'slug': 'rpc-dubbo',
        'md': 'rpc-dubbo\u5f00\u53d1\u624b\u518c.md',
        'active': 'Dubbo',
        'export': 'RpcDubboDocPage',
        'breadcrumb': 'Dubbo',
        'title': 'easyfk-rpc-dubbo Dubbo',
        'subtitle': 'Dubbo RPC \u2014 \u9ad8\u6027\u80fd\u8fdc\u7a0b\u670d\u52a1\u8c03\u7528',
        'prev_label': 'Kafka', 'prev_href': '/docs/reader/mq-kafka',
        'next_label': 'Spring Cloud', 'next_href': '/docs/reader/rpc-cloud',
        'footer': 'easyfk-rpc-dubbo \u2014 \u9ad8\u6027\u80fd RPC \u8fdc\u7a0b\u670d\u52a1\u8c03\u7528\u6846\u67b6\u3002',
    },
    {
        'slug': 'rpc-cloud',
        'md': 'rpc-cloud\u5f00\u53d1\u624b\u518c.md',
        'active': 'Spring Cloud',
        'export': 'RpcCloudDocPage',
        'breadcrumb': 'Spring Cloud',
        'title': 'easyfk-rpc-cloud Spring Cloud',
        'subtitle': 'Spring Cloud \u5fae\u670d\u52a1 \u2014 \u4e91\u539f\u751f\u670d\u52a1\u6cbb\u7406',
        'prev_label': 'Dubbo', 'prev_href': '/docs/reader/rpc-dubbo',
        'next_label': 'Redisson \u5206\u5e03\u5f0f\u9501', 'next_href': '/docs/reader/lock-redisson',
        'footer': 'easyfk-rpc-cloud \u2014 Spring Cloud \u5fae\u670d\u52a1\u6cbb\u7406\u6846\u67b6\u96c6\u6210\u3002',
    },
    {
        'slug': 'lock-redisson',
        'md': 'lock-redisson\u5f00\u53d1\u624b\u518c.md',
        'active': 'Redisson \u5206\u5e03\u5f0f\u9501',
        'export': 'LockRedissonDocPage',
        'breadcrumb': 'Redisson \u5206\u5e03\u5f0f\u9501',
        'title': 'easyfk-lock-redisson Redisson \u5206\u5e03\u5f0f\u9501',
        'subtitle': 'Redisson \u5206\u5e03\u5f0f\u9501 \u2014 \u9ad8\u53ef\u7528\u5206\u5e03\u5f0f\u4e92\u65a5\u65b9\u6848',
        'prev_label': 'Spring Cloud', 'prev_href': '/docs/reader/rpc-cloud',
        'next_label': '\u7ebf\u7a0b\u6c60', 'next_href': '/docs/reader/thread',
        'footer': 'easyfk-lock-redisson \u2014 \u9ad8\u53ef\u7528\u5206\u5e03\u5f0f\u4e92\u65a5\u9501\u65b9\u6848\u3002',
    },
    {
        'slug': 'thread',
        'md': 'thread\u5f00\u53d1\u624b\u518c.md',
        'active': '\u7ebf\u7a0b\u6c60',
        'export': 'ThreadDocPage',
        'breadcrumb': '\u7ebf\u7a0b\u6c60',
        'title': 'easyfk-thread \u7ebf\u7a0b\u6c60',
        'subtitle': '\u7ebf\u7a0b\u6c60\u7ba1\u7406 \u2014 \u9ad8\u6027\u80fd\u5e76\u53d1\u4efb\u52a1\u8c03\u5ea6',
        'prev_label': 'Redisson \u5206\u5e03\u5f0f\u9501', 'prev_href': '/docs/reader/lock-redisson',
        'next_label': 'Disruptor', 'next_href': '/docs/reader/disruptor',
        'footer': 'easyfk-thread \u2014 \u9ad8\u6027\u80fd\u7ebf\u7a0b\u6c60\u7ba1\u7406\uff0c\u63d0\u5347\u5e76\u53d1\u4efb\u52a1\u8c03\u5ea6\u6548\u7387\u3002',
    },
    {
        'slug': 'disruptor',
        'md': 'disruptor\u5f00\u53d1\u624b\u518c.md',
        'active': 'Disruptor',
        'export': 'DisruptorDocPage',
        'breadcrumb': 'Disruptor',
        'title': 'easyfk-disruptor Disruptor',
        'subtitle': 'Disruptor \u9ad8\u6027\u80fd\u961f\u5217 \u2014 \u65e0\u9501\u5e76\u53d1\u7f16\u7a0b',
        'prev_label': '\u7ebf\u7a0b\u6c60', 'prev_href': '/docs/reader/thread',
        'next_label': 'Fory \u5e8f\u5217\u5316', 'next_href': '/docs/reader/fory',
        'footer': 'easyfk-disruptor \u2014 \u9ad8\u6027\u80fd\u65e0\u9501\u961f\u5217\uff0c\u5b9e\u73b0\u6781\u81f4\u5e76\u53d1\u6027\u80fd\u3002',
    },
    {
        'slug': 'fory',
        'md': 'fory\u5e8f\u5217\u5316\u5f00\u53d1\u624b\u518c.md',
        'active': 'Fory \u5e8f\u5217\u5316',
        'export': 'ForyDocPage',
        'breadcrumb': 'Fory \u5e8f\u5217\u5316',
        'title': 'easyfk-fory Fory \u5e8f\u5217\u5316',
        'subtitle': 'Fory \u5e8f\u5217\u5316 \u2014 \u9ad8\u6027\u80fd\u5bf9\u8c61\u5e8f\u5217\u5316\u6846\u67b6',
        'prev_label': 'Disruptor', 'prev_href': '/docs/reader/disruptor',
        'next_label': 'Chronicle Map', 'next_href': '/docs/reader/chronicle-map',
        'footer': 'easyfk-fory \u2014 \u9ad8\u6027\u80fd\u5e8f\u5217\u5316\u6846\u67b6\uff0c\u52a0\u901f\u6570\u636e\u4f20\u8f93\u4e0e\u5b58\u50a8\u3002',
    },
]


def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def extract_core_parts(core_content):
    """Extract reusable parts from core/page.tsx."""
    lines = core_content.split('\n')
    # imports: lines 0-7 (indexes)
    imports = '\n'.join(lines[0:8])
    # tabs: line 9
    tabs_line = lines[9]
    # sidebar: lines 11-22
    sidebar_lines = lines[11:23]
    return imports, tabs_line, sidebar_lines


def make_sidebar(sidebar_lines, active_label, active_group=None):
    """Modify sidebar to set the correct active item."""
    result = []

    for line in sidebar_lines:
        # Step 1: restore href for previously-active core item
        line = line.replace('{ label: "\u57fa\u7840\u6838\u5fc3", active: true }',
                            '{ label: "\u57fa\u7840\u6838\u5fc3", href: "/docs/reader/core" }')
        # Step 2: make the target item active (remove its href, add active)
        pattern = r'\{ label: "' + re.escape(active_label) + r'", href: "[^"]*" \}'
        replacement = '{ label: "' + active_label + '", active: true }'
        if re.search(pattern, line):
            line = re.sub(pattern, replacement, line)
        result.append(line)
    return result


def parse_md_sections(md_content):
    """Parse markdown into a list of (heading_level, title, content_lines)."""
    sections = []
    current = None
    in_code_block = False
    code_lang = ''

    for line in md_content.split('\n'):
        stripped = line.strip()

        if stripped.startswith('```') and not in_code_block:
            in_code_block = True
            code_lang = stripped[3:].strip()
            if current:
                current['content'].append(('code_start', code_lang))
            continue
        elif stripped.startswith('```') and in_code_block:
            in_code_block = False
            if current:
                current['content'].append(('code_end', ''))
            continue

        if in_code_block:
            if current:
                current['content'].append(('code_line', line))
            continue

        if stripped.startswith('## '):
            if current:
                sections.append(current)
            title = stripped[3:].strip()
            current = {'level': 2, 'title': title, 'content': []}
        elif stripped.startswith('### '):
            if current:
                current['content'].append(('h3', stripped[4:].strip()))
        elif stripped.startswith('#### '):
            if current:
                current['content'].append(('h4', stripped[5:].strip()))
        elif stripped.startswith('| ') and current:
            current['content'].append(('table_row', stripped))
        elif stripped.startswith('- ') and current:
            current['content'].append(('bullet', stripped[2:]))
        elif stripped.startswith('---'):
            pass
        elif stripped == '':
            if current:
                current['content'].append(('blank', ''))
        else:
            if current:
                current['content'].append(('para', stripped))

    if current:
        sections.append(current)

    return sections


def escape_jsx(text):
    """Escape text for JSX string content."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def escape_jsx_attr(text):
    """Escape for JSX template literal."""
    text = text.replace('\\', '\\\\')
    text = text.replace('`', '\\`')
    text = text.replace('${', '\\${')
    return text


def make_sec_id(idx):
    return f'sec-{idx}'


def inline_format(text):
    """Convert inline markdown to JSX."""
    # Replace `code` with <InlineCode>code</InlineCode>
    parts = []
    last = 0
    for m in re.finditer(r'`([^`]+)`', text):
        if m.start() > last:
            parts.append(escape_jsx(text[last:m.start()]))
        parts.append(f'<InlineCode>{escape_jsx(m.group(1))}</InlineCode>')
        last = m.end()
    if last < len(text):
        parts.append(escape_jsx(text[last:]))
    result = ''.join(parts)

    # Replace **bold** with <Strong>bold</Strong>
    result = re.sub(r'\*\*([^*]+)\*\*', r'<Strong>\1</Strong>', result)

    return result


def build_table_jsx(rows_data):
    """Convert table rows to DocTable JSX."""
    if len(rows_data) < 2:
        return ''
    # First row is headers, second is separator, rest is data
    headers = [c.strip() for c in rows_data[0].strip('|').split('|')]
    data_rows = []
    for row in rows_data[2:]:  # skip header and separator
        cells = [c.strip() for c in row.strip('|').split('|')]
        data_rows.append(cells)

    h_str = ', '.join([f'"{escape_jsx(h)}"' for h in headers])
    rows_str_parts = []
    for row in data_rows:
        cells_str = ', '.join([f'"{escape_jsx(c)}"' for c in row])
        rows_str_parts.append(f'                  [{cells_str}]')
    rows_str = ',\n'.join(rows_str_parts)

    return f'''              <DocTable
                headers={{[{h_str}]}}
                rows={{[
{rows_str},
                ]}}
              />'''


def generate_body(sections):
    """Generate TSX body content from parsed markdown sections."""
    parts = []

    for idx, section in enumerate(sections):
        sec_id = make_sec_id(idx)
        title = section['title']
        parts.append(f'')
        parts.append(f'              {{/* ============== {title} ============== */}}')
        parts.append(f'              <H2 id="{sec_id}">{escape_jsx(title)}</H2>')

        content = section['content']
        i = 0
        code_lines = []
        code_lang = ''
        in_code = False
        table_rows = []
        in_table = False

        while i < len(content):
            ctype, cval = content[i]

            if ctype == 'code_start':
                if in_table:
                    parts.append(build_table_jsx(table_rows))
                    table_rows = []
                    in_table = False
                in_code = True
                code_lang = cval if cval else 'plaintext'
                code_lines = []
                i += 1
                continue

            if ctype == 'code_end':
                in_code = False
                code_content = '\n'.join(code_lines)
                code_content_escaped = escape_jsx_attr(code_content)
                parts.append(f'              <CodeBlock lang="{code_lang}">{{\`{code_content_escaped}\`}}</CodeBlock>')
                code_lines = []
                i += 1
                continue

            if in_code:
                code_lines.append(cval)
                i += 1
                continue

            if ctype == 'table_row':
                if not in_table:
                    in_table = True
                    table_rows = []
                table_rows.append(cval)
                i += 1
                continue
            else:
                if in_table:
                    parts.append(build_table_jsx(table_rows))
                    table_rows = []
                    in_table = False

            if ctype == 'h3':
                parts.append(f'')
                parts.append(f'              <H3>{escape_jsx(cval)}</H3>')
            elif ctype == 'h4':
                parts.append(f'              <H4>{escape_jsx(cval)}</H4>')
            elif ctype == 'para':
                formatted = inline_format(cval)
                parts.append(f'              <P>{formatted}</P>')
            elif ctype == 'bullet':
                # Collect consecutive bullets
                bullets = [cval]
                j = i + 1
                while j < len(content) and content[j][0] == 'bullet':
                    bullets.append(content[j][1])
                    j += 1
                items = ', '.join([f'"{escape_jsx(b)}"' for b in bullets])
                parts.append(f'              <BulletList items={{[{items}]}} />')
                i = j
                continue
            elif ctype == 'blank':
                pass

            i += 1

        if in_table:
            parts.append(build_table_jsx(table_rows))

    return '\n'.join(parts)


def generate_outline(sections):
    """Generate outlineItems from section headings."""
    items = []
    for idx, section in enumerate(sections):
        sec_id = make_sec_id(idx)
        label = section['title']
        # Clean up: remove leading number and dot
        clean_label = re.sub(r'^\d+\.\s*', '', label)
        items.append(f'  {{ id: "{sec_id}", label: "{escape_jsx(clean_label)}" }}')
    return items


def assemble_page(page_config, core_imports, core_tabs, sidebar_lines, outline_items, body_content):
    """Assemble the complete page TSX."""
    active = page_config['active']
    export_name = page_config['export']
    breadcrumb = page_config['breadcrumb']
    title = page_config['title']
    subtitle = page_config['subtitle']
    prev_label = page_config['prev_label']
    prev_href = page_config['prev_href']
    next_label = page_config['next_label']
    next_href = page_config['next_href']
    footer = page_config['footer']

    sidebar_str = '\n'.join(make_sidebar(sidebar_lines, active, page_config.get('active_group')))
    outline_str = ',\n'.join(outline_items)

    # reading time estimate
    reading_time = '~15 min'

    tsx = f'''"use client"

import {{ useState, useRef, useEffect }} from "react"
import Link from "next/link"
import {{ Search, Copy, Check, Lightbulb, ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, AlertTriangle }} from "lucide-react"

import {{ ScrollArea }} from "@/components/ui/scroll-area"
import {{ cn }} from "@/lib/utils"

const tabs = {core_tabs}

{sidebar_str}

const outlineItems = [
{outline_str},
]

function CodeBlock({{ lang, children }}: {{ lang: string; children: string }}) {{
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {{
    navigator.clipboard.writeText(children).then(() => {{
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }})
  }}
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">{{lang}}</span>
        <button type="button" onClick={{handleCopy}} className={{cn("flex items-center gap-1.5 transition-colors", copied ? "text-[#00FF88]" : "text-[#525252] hover:text-[#9CA3AF]")}}>
          {{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}}
          <span className="text-[11px]">{{copied ? "\u5df2\u590d\u5236" : "\u590d\u5236"}}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4">
        <code className="whitespace-pre font-mono text-[13px] leading-[1.7] text-[#E5E5E5]">{{children}}</code>
      </pre>
    </div>
  )
}}

function DocTable({{ headers, rows }}: {{ headers: string[]; rows: (string | React.ReactNode)[][] }}) {{
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#1F2937]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#1F2937] bg-[#161B22]">
            {{headers.map((h, i) => (
              <th key={{i}} className="px-4 py-2.5 font-mono text-[11px] font-semibold tracking-wide text-[#9CA3AF]">
                {{h}}
              </th>
            ))}}
          </tr>
        </thead>
        <tbody>
          {{rows.map((row, ri) => (
            <tr key={{ri}} className="border-b border-[#1F2937] last:border-b-0">
              {{row.map((cell, ci) => (
                <td key={{ci}} className="px-4 py-2.5 text-[13px] leading-[1.6] text-[#9CA3AF]">
                  {{cell}}
                </td>
              ))}}
            </tr>
          ))}}
        </tbody>
      </table>
    </div>
  )
}}

function TipBox({{ title = "TIP", children }}: {{ title?: string; children: React.ReactNode }}) {{
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#00FF8830] bg-[#00FF880A] px-5 py-4">
      <Lightbulb className="mt-0.5 size-[18px] shrink-0 text-[#00FF88]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#00FF88]">{{title}}</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{{children}}</div>
      </div>
    </div>
  )
}}

function WarnBox({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#FBBF2430] bg-[#FBBF240A] px-5 py-4">
      <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-[#FBBF24]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#FBBF24]">\u6ce8\u610f</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{{children}}</div>
      </div>
    </div>
  )
}}

function H2({{ id, children }}: {{ id?: string; children: React.ReactNode }}) {{
  return (
    <div id={{id}} className="flex items-center gap-3 scroll-mt-4">
      <h2 className="font-display text-[24px] font-bold text-white">{{children}}</h2>
      <span className="text-[14px] text-[#00FF8860]">\u2728</span>
    </div>
  )
}}

function H3({{ children }}: {{ children: React.ReactNode }}) {{
  return <h3 className="font-display text-[18px] font-bold text-white">{{children}}</h3>
}}

function H4({{ children }}: {{ children: React.ReactNode }}) {{
  return <h4 className="font-display text-[15px] font-semibold text-[#E5E5E5]">{{children}}</h4>
}}

function P({{ children }}: {{ children: React.ReactNode }}) {{
  return <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">{{children}}</p>
}}

function BulletList({{ items }}: {{ items: React.ReactNode[] }}) {{
  return (
    <ul className="flex flex-col gap-2 pl-5">
      {{items.map((item, i) => (
        <li key={{i}} className="list-disc text-[15px] leading-[1.8] text-[#9CA3AF]">{{item}}</li>
      ))}}
    </ul>
  )
}}

function NumberList({{ items }}: {{ items: React.ReactNode[] }}) {{
  return (
    <ol className="flex flex-col gap-2 pl-5">
      {{items.map((item, i) => (
        <li key={{i}} className="list-decimal text-[15px] leading-[1.8] text-[#9CA3AF]">{{item}}</li>
      ))}}
    </ol>
  )
}}

function InlineCode({{ children }}: {{ children: React.ReactNode }}) {{
  return <code className="rounded bg-[#1F2937] px-1.5 py-0.5 font-mono text-[13px] text-[#00FF88]">{{children}}</code>
}}

function Strong({{ children }}: {{ children: React.ReactNode }}) {{
  return <span className="font-semibold text-[#E5E5E5]">{{children}}</span>
}}

function Highlight({{ children }}: {{ children: React.ReactNode }}) {{
  return <span className="rounded bg-[#00FF8820] px-1 py-0.5 text-[#00FF88]">{{children}}</span>
}}

export default function {export_name}() {{
  const [activeTab, setActiveTab] = useState(0)
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(false)
  const [activeSection, setActiveSection] = useState(outlineItems[0].id)
  const contentWrapRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {{
    const viewport = contentWrapRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]')
    if (!viewport) return
    const onScroll = () => {{
      setAtTop(viewport.scrollTop <= 100)
      setAtBottom(viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 100)

      let current = outlineItems[0].id
      for (const item of outlineItems) {{
        const el = document.getElementById(item.id)
        if (el) {{
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = item.id
        }}
      }}
      setActiveSection(current)
    }}
    viewport.addEventListener("scroll", onScroll, {{ passive: true }})
    return () => viewport.removeEventListener("scroll", onScroll)
  }}, [])

  const scrollToSection = (id: string) => {{
    const el = document.getElementById(id)
    el?.scrollIntoView({{ behavior: 'smooth' }})
  }}

  return (
    <div className="relative isolate h-screen overflow-hidden bg-[#0B0C0E] text-white">
      {{/* Nav Bar */}}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#1F2937] bg-[#0B0C0E] px-6">
        <Link href="/docs" className="inline-flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-[#00FF88] font-display text-sm font-bold text-[#0B0C0E]">
            E
          </span>
          <span className="size-[5px] rounded-full bg-[#00FF88]" />
          <span className="font-display text-[15px] font-bold text-white">EasyBuild Docs</span>
        </Link>
        <div className="flex items-center gap-2 text-[13px] text-[#525252]">
          <span>\u6587\u6863</span>
          <span>/</span>
          <span>\u540e\u7aef</span>
          <span>/</span>
          <span className="font-medium text-[#9CA3AF]">{breadcrumb}</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-[#1F2937] bg-white/[0.03] px-3 py-1.5"
        >
          <Search className="size-3.5 text-[#525252]" />
          <span className="text-[12px] text-[#525252]">\u641c\u7d22\u6587\u6863...</span>
          <span className="font-mono text-[11px] text-[#525252]">\u2318K</span>
        </button>
      </header>

      {{/* Doc Body */}}
      <div className="flex" style={{{{ minHeight: "calc(100vh - 56px)" }}}}>
        {{/* Left Sidebar */}}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[280px] shrink-0 border-r border-[#1F2937] bg-[#0A0B0D]">
          <div className="flex border-b border-[#1F2937]">
            {{tabs.map((tab, i) => (
              <button
                key={{tab}}
                type="button"
                onClick={{() => setActiveTab(i)}}
                className={{cn(
                  "flex h-10 flex-1 items-center justify-center text-[12px]",
                  i === activeTab
                    ? "border-b-2 border-[#00FF88] font-semibold text-white"
                    : "font-medium text-[#525252]"
                )}}
              >
                {{tab}}
              </button>
            ))}}
          </div>
          <ScrollArea className="h-[calc(100vh-56px-40px)]">
            <nav className="flex flex-col gap-0.5 py-4">
              {{sidebarSections.map((section, si) => (
                <div key={{si}}>
                  {{section.title && (
                    <div className="flex h-9 items-center px-4">
                      <span className="font-mono text-[13px] font-semibold tracking-[0.5px] text-[#9CA3AF]">
                        {{section.title}}
                      </span>
                    </div>
                  )}}
                  {{section.items.map((item) => (
                    item.href ? (
                      <Link
                        key={{item.label}}
                        href={{item.href}}
                        className="flex h-9 items-center px-5 text-[13px] text-[#9CA3AF]"
                      >
                        {{item.label}}
                      </Link>
                    ) : (
                      <div
                        key={{item.label}}
                        className={{cn(
                          "flex h-9 items-center",
                          "active" in item && item.active
                            ? "border-l-[3px] border-[#00FF88] bg-gradient-to-r from-[#00FF8812] to-transparent px-5 text-[13px] font-semibold text-white"
                            : section.title
                              ? "px-8 text-[12px] text-[#737373]"
                              : "px-5 text-[13px] text-[#9CA3AF]"
                        )}}
                      >
                        {{item.label}}
                      </div>
                    )
                  ))}}
                </div>
              ))}}
            </nav>
          </ScrollArea>
        </aside>

        {{/* Main Content */}}
        <div ref={{contentWrapRef}} className="relative flex-1">
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div ref={{topRef}} />
          <div className="mx-auto max-w-[800px] px-[60px] py-10">
            <div className="flex flex-col gap-8">

              <h1 className="font-display text-[36px] font-bold tracking-[-1px] text-white">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[#525252]">
                <span>{subtitle}</span>
                <span className="size-1 rounded-full bg-[#525252]" />
                <span>\u9605\u8bfb\u65f6\u95f4 {reading_time}</span>
              </div>
              <div className="h-px bg-[#1F2937]" />

{body_content}

              {{/* Footer note */}}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  {footer}
                </p>
              </div>

              {{/* Separator */}}
              <div className="h-px bg-[#1F2937]" />

              {{/* Page Navigation */}}
              <div className="flex gap-4">
                <Link href="{prev_href}" className="flex flex-1 flex-col gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <ArrowLeft className="size-3.5" />
                    <span>\u4e0a\u4e00\u7bc7</span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">{prev_label}</span>
                </Link>
                <Link href="{next_href}" className="flex flex-1 flex-col items-end gap-1 rounded-[10px] border border-[#1F2937] bg-white/[0.024] p-5 transition-colors hover:border-[#374151]">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#525252]">
                    <span>\u4e0b\u4e00\u7bc7</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#E5E5E5]">{next_label}</span>
                </Link>
              </div>

            </div>
          </div>
          <div ref={{bottomRef}} />
        </ScrollArea>
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <button
            type="button"
            disabled={{atTop}}
            onClick={{() => topRef.current?.scrollIntoView({{ behavior: 'smooth' }})}}
            className={{cn(
              "flex size-9 items-center justify-center rounded-full border transition-colors",
              atTop
                ? "cursor-not-allowed border-[#1F2937]/50 bg-[#161B22]/50 text-[#525252]/30"
                : "border-[#1F2937] bg-[#161B22] text-[#525252] hover:border-[#374151] hover:text-[#9CA3AF]"
            )}}
            title="\u56de\u5230\u9876\u90e8"
          >
            <ArrowUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={{atBottom}}
            onClick={{() => bottomRef.current?.scrollIntoView({{ behavior: 'smooth' }})}}
            className={{cn(
              "flex size-9 items-center justify-center rounded-full border transition-colors",
              atBottom
                ? "cursor-not-allowed border-[#1F2937]/50 bg-[#161B22]/50 text-[#525252]/30"
                : "border-[#1F2937] bg-[#161B22] text-[#525252] hover:border-[#374151] hover:text-[#9CA3AF]"
            )}}
            title="\u56de\u5230\u5e95\u90e8"
          >
            <ArrowDown className="size-4" />
          </button>
        </div>
        </div>

        {{/* Right Sidebar */}}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[240px] shrink-0 border-l border-[#1F2937] bg-[#0A0B0D]">
          <ScrollArea className="h-full px-6 py-10">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#525252]">\u672c\u9875\u5927\u7eb2</span>
              <div className="flex flex-col">
                {{outlineItems.map((item) => (
                  <button
                    key={{item.id}}
                    type="button"
                    onClick={{() => scrollToSection(item.id)}}
                    className={{cn(
                      "flex h-8 items-center border-l-2 px-3 text-left text-[12px] transition-colors",
                      activeSection === item.id
                        ? "border-[#00FF88] font-medium text-[#00FF88]"
                        : "border-transparent text-[#737373] hover:text-[#9CA3AF]"
                    )}}
                  >
                    {{item.label}}
                  </button>
                ))}}
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>

      {{/* AI Floating Button */}}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <div className="rounded-lg border border-[#1F2937] bg-[#161B22] px-3.5 py-2 text-[12px] text-[#9CA3AF]">
          \u5bf9\u6587\u6863\u6709\u7591\u95ee\uff1f\u95ee AI
        </div>
        <button
          type="button"
          className="flex size-[52px] items-center justify-center rounded-full bg-[#00FF88] shadow-[0_4px_20px_#00FF8840] transition-transform hover:scale-105"
        >
          <Sparkles className="size-6 text-[#0B0C0E]" />
        </button>
      </div>
    </div>
  )
}}
'''
    return tsx


def main():
    print('Reading core template...')
    core_content = read_file(CORE_PATH)
    core_imports, core_tabs, sidebar_lines = extract_core_parts(core_content)

    # Extract the tabs line value (just the array part)
    tabs_match = re.search(r'const tabs = (\[.*?\])', core_tabs)
    tabs_value = tabs_match.group(1) if tabs_match else '["Backend", "Business", "Frontend", "Mobile"]'

    for page in PAGES:
        slug = page['slug']
        md_path = os.path.join(DOC_DIR, page['md'])
        out_dir = os.path.join(READER_DIR, slug)
        out_path = os.path.join(out_dir, 'page.tsx')

        print(f'Processing {slug}...')

        if not os.path.exists(md_path):
            print(f'  WARNING: markdown not found: {md_path}')
            continue

        os.makedirs(out_dir, exist_ok=True)

        md_content = read_file(md_path)
        sections = parse_md_sections(md_content)
        outline_items = generate_outline(sections)
        body_content = generate_body(sections)

        tsx = assemble_page(page, core_imports, tabs_value, sidebar_lines, outline_items, body_content)

        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(tsx)

        # Verify
        with open(out_path, 'rb') as f:
            raw = f.read()
        has_qmark = b'"??"' in raw or b'"???"' in raw or b'"????"' in raw
        has_utf8 = b'\xe5' in raw  # Common first byte of CJK UTF-8
        print(f'  Written: {out_path}')
        print(f'  Has UTF-8 Chinese: {has_utf8}, Has question marks: {has_qmark}')
        if has_qmark:
            print(f'  ERROR: File contains corrupted Chinese!')
            sys.exit(1)

    print('All files generated successfully!')


if __name__ == '__main__':
    main()
