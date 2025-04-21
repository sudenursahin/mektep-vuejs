<template>
    <div class="editor-wrapper">
        <div class="editor-header">
            <button 
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                <i class="fas fa-bold"></i>
            </button>
            <button 
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                <i class="fas fa-italic"></i>
            </button>
            <button 
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            >
                <i class="fas fa-heading"></i>
            </button>
            <button 
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
            >
                <i class="fas fa-list"></i>
            </button>
        </div>
        <EditorContent :editor="editor" class="editor-content" />
    </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const editor = new Editor({
    content: props.modelValue,
    extensions: [
        StarterKit
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

watch(() => props.modelValue, (newValue) => {
    if (newValue !== editor.getHTML()) {
        editor.commands.setContent(newValue)
    }
})
</script>

<style scoped>
.editor-wrapper {
    border: 1px solid #DAA520;
    border-radius: 4px;
    overflow: hidden;
}

.editor-header {
    padding: 0.5rem;
    background-color: #f8f8f8;
    border-bottom: 1px solid #DAA520;
    display: flex;
    gap: 0.5rem;
}

.editor-header button {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    color: #800020;
}

.editor-header button:hover {
    background-color: #f0f0f0;
}

.editor-header button.is-active {
    background-color: #800020;
    color: white;
}

.editor-content {
    padding: 1rem;
    min-height: 200px;
    background-color: white;
}

:deep(.ProseMirror) {
    outline: none;
    min-height: 200px;
    color: #000000;
}

:deep(.ProseMirror p) {
    margin: 1em 0;
    color: #000000;
}

:deep(.ProseMirror h2) {
    color: #800020;
    font-family: 'Amiri', serif;
    margin: 1.5em 0 0.5em;
}

:deep(.ProseMirror ul) {
    padding-left: 1.5em;
    margin: 1em 0;
}

:deep(.ProseMirror li) {
    margin: 0.5em 0;
}
</style>


