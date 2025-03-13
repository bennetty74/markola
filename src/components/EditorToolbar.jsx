import React, { useState, useRef, useEffect } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  UnderlineIcon,
  StrikethroughIcon,
  TableCellsIcon,
  PaintBrushIcon,
  SwatchIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  CheckBadgeIcon,
  MinusIcon,
  CheckCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  VariableIcon
} from '@heroicons/react/24/outline';
import { RxTextAlignCenter, RxHeading } from 'react-icons/rx';
import ToolButton from './editor/ToolButton';
import Dropdown from './editor/Dropdown';

function Toolbar({ editor, theme, setSelectedFile }) {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const linkButtonRef = useRef(null);
  const linkDropdownRef = useRef(null);
  const headingButtonRef = useRef(null);
  const headingDropdownRef = useRef(null);

  if (!editor) return null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        linkDropdownRef.current &&
        !linkDropdownRef.current.contains(event.target) &&
        linkButtonRef.current &&
        !linkButtonRef.current.contains(event.target)
      ) {
        setIsLinkOpen(false);
      }
      if (
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(event.target) &&
        headingButtonRef.current &&
        !headingButtonRef.current.contains(event.target)
      ) {
        setIsHeadingOpen(false);
      }
      if (
        isColorOpen &&
        !event.target.closest('.color-dropdown')
      ) {
        setIsColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorOpen, isLinkOpen, isHeadingOpen]);

  const setLink = () => {
    setIsLinkOpen(true);
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkTitle(editor.state.selection.content().text || '');
  };

  // 新增退出编辑函数
  const exitEdit = () => {
    setSelectedFile(null);
  };

  const confirmLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .command(({ tr }) => {
          if (linkTitle.trim()) {
            const { from, to } = editor.state.selection;
            tr.insertText(linkTitle, from, to);
          }
          return true;
        })
        .run();
    }
    setIsLinkOpen(false);
    setLinkTitle('');
    setLinkUrl('');
  };

  const addImage = () => editor.chain().focus().setImage({ src: '', isPlaceholder: true }).run();
  const toggleHighlight = () => editor.chain().focus().toggleHighlight().run();
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setIsColorOpen(false);
  };
  const getCurrentColor = () => editor.getAttributes('textStyle')?.color || null;

  const colors = [
    { name: '棕色', value: '#854836' },
    { name: '红色', value: '#FF8989' },
    { name: '蓝色', value: '#4F959D' },
    { name: '绿色', value: '#89AC46' },
    { name: '灰色', value: '#ADB2D4' },
  ];
  
  const insertMath = () => {
    if (!editor) {
      console.error('Editor 未初始化');
      return;
    }
    editor
    .chain()
    .focus()
    .insertMathBlock({ latex: '\\sum_{i=0}^n i^2' }) // 使用自定义命令
    .run();
  }

  return (
    <div className="toolbar w-full h-[58px] fixed top-[45px] z-50 bg-gray-100 dark:bg-gray-900 flex flex-wrap gap-1.5 px-2 py-1 shadow-md border-b border-gray-300 dark:border-gray-700">
      <ToolButton onClick={() => editor.chain().focus().undo().run()} title="撤销">
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().redo().run()} title="重做">
        <ArrowUturnRightIcon className="w-5 h-5" />
      </ToolButton>

      <div className="flex relative">
        <ToolButton
          ref={headingButtonRef}
          onClick={() => setIsHeadingOpen(!isHeadingOpen)}
          isActive={editor.isActive('heading')}
          title="标题"
        >
          <RxHeading className="w-5 h-5" />
        </ToolButton>
        <Dropdown isOpen={isHeadingOpen} refProp={headingDropdownRef} className="w-28">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level }).run();
                setIsHeadingOpen(false);
              }}
              className={`w-full text-left px-2 py-1 rounded-md ${
                editor.isActive('heading', { level })
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              } transition-colors`}
            >
              {level}级标题
            </button>
          ))}
        </Dropdown>
      </div>

      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="加粗"
      >
        <BoldIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="斜体"
      >
        <ItalicIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="下划线"
      >
        <UnderlineIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="删除线"
      >
        <StrikethroughIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={editor.isActive('horizontalRule')}
        title="分割线"
      >
        <MinusIcon className="w-5 h-5" />
      </ToolButton>

      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="左对齐"
      >
        <Bars3BottomLeftIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="居中对齐"
      >
        <RxTextAlignCenter className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="右对齐"
      >
        <Bars3BottomRightIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="两边对齐"
      >
        <Bars3Icon className="w-5 h-5" />
      </ToolButton>

      <ToolButton onClick={toggleHighlight} isActive={editor.isActive('highlight')} title="高亮">
        <PaintBrushIcon className="w-5 h-5" />
      </ToolButton>

      <div className="flex relative">
        <ToolButton
          onClick={() => setIsColorOpen(!isColorOpen)}
          isActive={editor.isActive('textStyle')}
          title="文字颜色"
        >
          <SwatchIcon className="w-5 h-5" />
        </ToolButton>
        <Dropdown isOpen={isColorOpen} className="w-32 color-dropdown">
          {colors.map((color) => {
            const currentColor = getCurrentColor();
            const isChecked = currentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => setTextColor(color.value)}
                className="flex items-center w-full px-2 py-1 text-left hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <span
                  className="w-4 h-4 mr-2 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-gray-700 dark:text-gray-300">{color.name}</span>
                {isChecked && <CheckCircleIcon className="w-5 h-5 ml-2 text-gray-500" />}
              </button>
            );
          })}
        </Dropdown>
      </div>

      <ToolButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        isActive={editor.isActive('table')}
        title="表格"
      >
        <TableCellsIcon className="w-5 h-5" />
      </ToolButton>

      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="无序列表"
      >
        <ListBulletIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="有序列表"
      >
        <NumberedListIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        title="待办任务"
      >
        <CheckBadgeIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="行内代码"
      >
        <CodeBracketIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="代码块"
      >
        <CodeBracketSquareIcon className="w-5 h-5" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="引用"
      >
        <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
      </ToolButton>

      <div className="flex relative">
        <ToolButton
          ref={linkButtonRef}
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="链接"
        >
          <LinkIcon className="w-5 h-5" />
        </ToolButton>
        <Dropdown isOpen={isLinkOpen} refProp={linkDropdownRef} className="w-64 right-0">
          <div className="mb-2">
            <label className="block text-sm text-gray-700 dark:text-gray-300">标题</label>
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="链接标题"
              className="w-full p-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-700 dark:text-gray-300">URL</label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsLinkOpen(false)}
              className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              onClick={confirmLink}
              className="px-2 py-1 text-sm text-white bg-gray-800 hover:bg-gray-600 rounded transition-colors"
            >
              确定
            </button>
          </div>
        </Dropdown>
      </div>
      <ToolButton onClick={addImage} isActive={editor.isActive('image')} title="图片">
        <PhotoIcon className="w-5 h-5" />
      </ToolButton>

      <ToolButton onClick={insertMath} isActive={editor.isActive('math')} title="数学公式">
        <VariableIcon className="w-5 h-5" />
      </ToolButton>

      <ToolButton onClick={exitEdit} isActive={editor.isActive('exit')} title="退出编辑">
        <ArrowLeftStartOnRectangleIcon className="w-5 h-5 rotate-180" />
      </ToolButton>


    </div>
  );
}

export default Toolbar;