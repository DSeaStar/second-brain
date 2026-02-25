"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  MessageSquare, 
  Brain,
  Calendar,
  Tag,
  Clock,
  Filter,
  Plus,
  Settings,
  ChevronRight,
  MoreHorizontal,
  Sparkles
} from "lucide-react";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { zhCN } from "date-fns/locale";

// Types
type ContentType = "note" | "conversation" | "memory";

interface BrainItem {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  source?: string;
}

// Mock data
const mockData: BrainItem[] = [
  {
    id: "1",
    type: "conversation",
    title: "飞书机器人配置",
    content: "用户配置了飞书机器人，App ID: cli_a917d254a03a9bd1。设置了每天4个时间点的喝水提醒：10:00、12:00、15:00、18:00。",
    summary: "完成飞书机器人配置和喝水提醒设置",
    tags: ["飞书", "机器人", "配置"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    source: "feishu"
  },
  {
    id: "2",
    type: "memory",
    title: "用户偏好记录",
    content: "用户希望构建第二大脑系统，用于管理笔记、对话和记忆。对生产力工具感兴趣，安装了多个 skills。",
    summary: "用户对第二大脑和生产力工具有强烈需求",
    tags: ["偏好", "系统", "生产力"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    source: "memory"
  },
  {
    id: "3",
    type: "note",
    title: "OpenClaw 配置笔记",
    content: "OpenClaw gateway 运行在本地，端口 18789。Feishu 通道已启用，使用 WebSocket 长连接模式。",
    summary: "OpenClaw 本地配置详情",
    tags: ["openclaw", "配置", "技术"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    source: "manual"
  },
  {
    id: "4",
    type: "conversation",
    title: "Skills 探索",
    content: "探索了 clawhub 上的 skills：todoist、github、summarize、spotify-player、openai-whisper。由于限流暂时未能安装。",
    summary: "发现并尝试安装多个实用 skills",
    tags: ["skills", "clawhub", "探索"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    source: "kimi"
  },
  {
    id: "5",
    type: "memory",
    title: "喝水提醒系统",
    content: "用户要求每天提醒喝水，设置了4个时间点。用户说"都听你的"，表现出对建议的信任。",
    summary: "建立了喝水提醒习惯系统",
    tags: ["健康", "习惯", "提醒"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    source: "memory"
  }
];

// Components
function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts 
}: { 
  activeTab: ContentType | "all"; 
  setActiveTab: (tab: ContentType | "all") => void;
  counts: Record<ContentType | "all", number>;
}) {
  const menuItems = [
    { id: "all" as const, icon: Sparkles, label: "全部内容", count: counts.all },
    { id: "note" as const, icon: FileText, label: "笔记", count: counts.note },
    { id: "conversation" as const, icon: MessageSquare, label: "对话", count: counts.conversation },
    { id: "memory" as const, icon: Brain, label: "记忆", count: counts.memory },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">第二大脑</h1>
            <p className="text-xs text-muted-foreground">Second Brain</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-neutral-100 px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
            标签
          </h3>
          <div className="flex flex-wrap gap-2 px-3">
            {["飞书", "配置", "生产力", "健康", "技术"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span>设置</span>
        </button>
      </div>
    </aside>
  );
}

function ItemCard({ item }: { item: BrainItem }) {
  const typeConfig = {
    note: { icon: FileText, color: "bg-blue-50 text-blue-600", label: "笔记" },
    conversation: { icon: MessageSquare, color: "bg-green-50 text-green-600", label: "对话" },
    memory: { icon: Brain, color: "bg-purple-50 text-purple-600", label: "记忆" },
  };

  const config = typeConfig[item.type];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    if (isToday(date)) return `今天 ${format(date, "HH:mm")}`;
    if (isYesterday(date)) return `昨天 ${format(date, "HH:mm")}`;
    if (isThisWeek(date)) return format(date, "EEEE HH:mm", { locale: zhCN });
    return format(date, "yyyy/MM/dd HH:mm", { locale: zhCN });
  };

  return (
    <div className="group bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all cursor-pointer animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{config.label}</span>
              <span>·</span>
              <span>{formatDate(item.createdAt)}</span>
              {item.source && (
                <>
                  <span>·</span>
                  <span className="text-neutral-400">{item.source}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {item.summary && (
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {item.summary}
        </p>
      )}

      <p className="text-sm text-neutral-500 line-clamp-3 mb-4">
        {item.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-neutral-50 text-neutral-500 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-400 transition-colors" />
      </div>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
        {trend && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ContentType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = useMemo(() => {
    return mockData.filter((item) => {
      const matchesTab = activeTab === "all" || item.type === activeTab;
      const matchesSearch = 
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: mockData.length,
      note: mockData.filter((i) => i.type === "note").length,
      conversation: mockData.filter((i) => i.type === "conversation").length,
      memory: mockData.filter((i) => i.type === "memory").length,
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-md border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索笔记、对话、记忆..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                <Plus className="w-4 h-4" />
                <span>新建</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="总内容数"
              value={counts.all.toString()}
              icon={Sparkles}
              trend="+12%"
            />
            <StatsCard
              title="本周对话"
              value={counts.conversation.toString()}
              icon={MessageSquare}
            />
            <StatsCard
              title="笔记数量"
              value={counts.note.toString()}
              icon={FileText}
            />
            <StatsCard
              title="记忆条目"
              value={counts.memory.toString()}
              icon={Brain}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 bg-white border border-border rounded-lg hover:bg-neutral-50 transition-colors">
                <Clock className="w-4 h-4" />
                <span>最近更新</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 bg-white border border-border rounded-lg hover:bg-neutral-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>时间范围</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 bg-white border border-border rounded-lg hover:bg-neutral-50 transition-colors">
                <Tag className="w-4 h-4" />
                <span>标签</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                共 {filteredItems.length} 条内容
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500">没有找到匹配的内容</p>
              <p className="text-sm text-muted-foreground mt-1">试试其他关键词或筛选条件</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
