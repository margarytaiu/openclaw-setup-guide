import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Folder,
  Github,
  Key,
  Lock,
  MessageSquare,
  Package,
  PlayCircle,
  RefreshCw,
  Server,
  Shield,
  Star,
  Terminal,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
        copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Скопировано
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy command
        </>
      )}
    </button>
  );
};

interface CommandBlockProps {
  command: string;
}

const CommandBlock = ({ command }: CommandBlockProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
    <code className="text-emerald-300 font-mono text-sm break-all">{command}</code>
    <CopyButton text={command} />
  </div>
);

const SecurityNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
    <Lock className="w-5 h-5 text-rose-400 mt-0.5" />
    <div className="text-rose-200 text-sm leading-relaxed">{children}</div>
  </div>
);

const App = () => {
  const totalSteps = 11;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number>(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const [progressChecks, setProgressChecks] = useState<Set<string>>(new Set());

  const trackerItems = useMemo(
    () => [
      'Server created',
      'SSH configured',
      'OpenClaw installed',
      'Telegram connected',
      'Security configured'
    ],
    []
  );

  const toggleStep = (id: number) => {
    setExpandedStep(expandedStep === id ? -1 : id);
  };

  const toggleComplete = (id: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedSteps(newCompleted);
  };

  const toggleTracker = (item: string) => {
    const next = new Set(progressChecks);
    if (next.has(item)) {
      next.delete(item);
    } else {
      next.add(item);
    }
    setProgressChecks(next);
  };

  useEffect(() => {
    if (completedSteps.size === totalSteps && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [completedSteps.size, showCelebration, totalSteps]);

  const progress = (completedSteps.size / totalSteps) * 100;
  const trackerProgress = (progressChecks.size / trackerItems.length) * 100;

  const steps: Step[] = [
    {
      id: 1,
      title: 'Create a server',
      icon: <Server className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: создать сервер, на котором будет работать OpenClaw.</p>
          <div className="bg-slate-900/60 rounded-xl p-4 space-y-2">
            <p className="text-slate-300">1. Откройте DigitalOcean</p>
            <p className="text-slate-300">2. Нажмите Create → Droplet</p>
            <p className="text-slate-300">3. Выберите Ubuntu 22.04</p>
            <p className="text-slate-300">4. Выберите минимальный тариф</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-cyan-300 font-medium">Пример IP-адреса:</p>
            <code className="text-cyan-200 font-mono">134.209.xxx.xxx</code>
          </div>
          <SecurityNote>
            OpenClaw запускается на отдельном сервере, чтобы изолировать его от вашего компьютера.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 2,
      title: 'Configure SSH access',
      icon: <Terminal className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: настроить безопасный доступ по SSH-ключу.</p>
          <CommandBlock command="ssh-keygen" />
          <div className="bg-slate-900/60 rounded-xl p-4">
            <p className="text-slate-300">Добавьте публичный ключ в настройки сервера и подключитесь:</p>
          </div>
          <CommandBlock command="ssh root@SERVER_IP" />
          <SecurityNote>
            Подключение по паролю может быть небезопасным — используйте SSH-ключи.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 3,
      title: 'Update the server',
      icon: <RefreshCw className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: обновить систему и закрыть известные уязвимости.</p>
          <CommandBlock command="apt update" />
          <CommandBlock command="apt upgrade" />
          <SecurityNote>
            Регулярные обновления защищают сервер от известных уязвимостей.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 4,
      title: 'Install dependencies',
      icon: <Package className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: установить Git и Docker для запуска OpenClaw.</p>
          <CommandBlock command="apt install git docker.io" />
          <div className="bg-slate-900/60 rounded-xl p-4">
            <p className="text-slate-300">Docker используется для запуска OpenClaw в контейнере.</p>
          </div>
          <SecurityNote>
            Контейнеризация создаёт дополнительный уровень изоляции и контроля.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 5,
      title: 'Create workspace',
      icon: <Folder className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: создать безопасную рабочую директорию для агента.</p>
          <CommandBlock command="mkdir /home/openclaw" />
          <CommandBlock command="mkdir /home/openclaw/workspace" />
          <CommandBlock command="cd /home/openclaw" />
          <SecurityNote>
            Workspace ограничивает область доступа агента и снижает риск утечек.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 6,
      title: 'Install OpenClaw',
      icon: <Github className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: скачать и запустить OpenClaw.</p>
          <CommandBlock command="git clone https://github.com/openclaw/openclaw" />
          <CommandBlock command="cd openclaw" />
          <CommandBlock command="docker compose up" />
          <SecurityNote>
            Убедитесь, что OpenClaw запущен именно на выделенном сервере.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 7,
      title: 'Configure AI provider',
      icon: <Key className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: подключить языковую модель для работы OpenClaw.</p>
          <div className="bg-slate-900/60 rounded-xl p-4">
            <p className="text-slate-300">Добавьте API-ключ в конфигурацию:</p>
          </div>
          <CommandBlock command="OPENAI_API_KEY=your_key_here" />
          <SecurityNote>
            Никогда не храните API-ключи прямо в коде или общих репозиториях.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 8,
      title: 'Create Telegram bot',
      icon: <Bot className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: создать Telegram-бота и получить токен.</p>
          <div className="bg-slate-900/60 rounded-xl p-4 space-y-2">
            <p className="text-slate-300">1. Откройте Telegram и найдите BotFather</p>
            <p className="text-slate-300">2. Введите команду:</p>
          </div>
          <CommandBlock command="/newbot" />
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-cyan-300">Пример токена:</p>
            <code className="text-cyan-200 font-mono">123456:ABCDEF...</code>
          </div>
          <SecurityNote>
            Токен Telegram-бота — секрет. Не публикуйте его в открытом доступе.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 9,
      title: 'Connect Telegram to OpenClaw',
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: добавить токен бота в конфигурацию OpenClaw.</p>
          <div className="bg-slate-900/60 rounded-xl p-4">
            <p className="text-slate-300">Добавьте токен в конфигурацию, затем отправьте сообщение:</p>
          </div>
          <CommandBlock command="hello" />
          <SecurityNote>
            Настройте бота так, чтобы он принимал команды только от вашего аккаунта.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 10,
      title: 'Security check',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: проверить базовую безопасность перед запуском.</p>
          <div className="space-y-3">
            {[
              'OpenClaw работает на отдельном сервере',
              'Доступ к серверу только через SSH',
              'Агент работает внутри workspace',
              'API-ключи не лежат в коде'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3">
                <div className="w-6 h-6 rounded-lg border border-slate-700 flex items-center justify-center">
                  <Check className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <SecurityNote>
            Эти проверки уменьшают риск атак, включая prompt injection.
          </SecurityNote>
        </div>
      )
    },
    {
      id: 11,
      title: 'Test the assistant',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Цель: убедиться, что агент отвечает в Telegram.</p>
          <CommandBlock command="hello" />
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-emerald-200">Если бот отвечает — установка завершена.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 px-8 py-6 rounded-2xl shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-center">🎉 Отличная работа!</h2>
              <p className="text-lg mt-2 text-center">Вы завершили все шаги OpenClaw Setup Lab.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-slate-900/70 border border-slate-800 px-4 py-2 rounded-full mb-6">
            <PlayCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300 text-sm">Setup Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            OpenClaw Setup Lab
          </h1>
          <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
            Разверните собственный OpenClaw-ассистент и подключите его к Telegram
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 text-sm">~60–90 минут</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">Beginner</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm">{completedSteps.size}/{totalSteps} шагов</span>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-[1.4fr_1fr] mb-10"
        >
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">В этом модуле</h2>
            <p className="text-slate-300 leading-relaxed">
              В этом модуле вы самостоятельно развернёте OpenClaw и подключите его к Telegram. В результате у вас
              будет собственный AI-ассистент, которым можно управлять через Telegram.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'аккаунт DigitalOcean (или другой VPS)',
                'установленный терминал',
                'Telegram'
              ].map((item) => (
                <div key={item} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Progress</h2>
            <div className="space-y-3">
              {trackerItems.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleTracker(item)}
                  className="w-full flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-left"
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center',
                      progressChecks.has(item)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'border-slate-700 text-slate-600'
                    )}
                  >
                    {progressChecks.has(item) && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Progress tracker</span>
                <span>{Math.round(trackerProgress)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${trackerProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mb-10"
        >
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Introduction</h2>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="OpenClaw Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-slate-400 text-sm mt-4">
              This video explains the architecture of OpenClaw and why it should run on an isolated server.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Architecture</h2>
            </div>
            <div className="space-y-4">
              {['Telegram', 'OpenClaw', 'VPS (отдельный сервер)', 'Workspace'].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">{item}</span>
                  {index < 3 && <span className="text-slate-600">↓</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Отдельный сервер изолирует систему и защищает ваши личные данные.
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Прогресс выполнения</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.section>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={cn(
                  'bg-slate-900/60 border rounded-2xl overflow-hidden transition-all duration-300',
                  completedSteps.has(step.id) ? 'border-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
                )}
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleComplete(step.id);
                      }}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0',
                        completedSteps.has(step.id)
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-600 hover:border-slate-500'
                      )}
                    >
                      {completedSteps.has(step.id) && <Check className="w-5 h-5" />}
                    </button>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                        completedSteps.has(step.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Step {step.id}</span>
                      <h3
                        className={cn(
                          'font-semibold text-lg transition-colors',
                          completedSteps.has(step.id) ? 'text-emerald-400' : 'text-white'
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-500"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedStep === step.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-slate-800">
                        <div className="pt-4">{step.content}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4">What you have now</h3>
          <ul className="space-y-2 text-slate-300">
            {['working OpenClaw instance', 'Telegram interface', 'isolated environment'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>OpenClaw Setup Lab • 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
