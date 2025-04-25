
import { Component ,ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  content: SafeHtml;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCode?: boolean;

}

@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;


  messages: Message[] = [];
  userInput = '';
  isLoading = false;
  errorMessage: string | null = null;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  private apiKey = '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'; // Remember to secure this properly
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;


    this.addMessage(this.userInput, 'user');
    const prompt = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': '<YOUR_SITE_URL>',

      'X-Title': '<YOUR_SITE_NAME>',

      'Content-Type': 'application/json'
    });

    const body = {
      "model": "microsoft/mai-ds-r1:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    };

    this.http.post(this.apiUrl, body, { headers }).subscribe({
      next: (response: any) => {

        const reply = response.choices?.[0]?.message?.content || "I didn't get that";
        const formattedReply = this.formatText(reply);
        this.addMessage(formattedReply, 'bot');

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred';
        this.addMessage("Sorry, I encountered an error. Please try again.", 'bot');
        this.isLoading = false;
      }
    });
  }

  private addMessage(content: string, sender: 'user' | 'bot') {

    const formattedContent = sender === 'bot' ? this.formatText(content) : content;
    this.messages.push({
      content: this.sanitizer.bypassSecurityTrustHtml(formattedContent),

      sender,
      timestamp: new Date()
    });
  }


  private formatText(text: string): string {
    let formatted = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang ? `language-${lang}` : 'language-none';
      const escaped = this.escapeHTML(code);
      const id = `code-${Math.random().toString(36).substr(2, 9)}`;
      return `
        <div class="code-block-wrapper">
          <button class="copy-btn" (click)="copyCode('${id}')">📋 Copy</button>
          <pre><code id="${id}" class="${language}">${escaped}</code></pre>
        </div>`;
    });

    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/---/g, '<hr>')
      .replace(/\n/g, '<br>');

    return formatted;
  }

  private escapeHTML(str: string): string {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
  }

  copyCode(id: string) {
    const codeElement = document.getElementById(id);
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent || '').then(() => {
        const buttons = document.querySelectorAll('.copy-btn');
        buttons.forEach(btn => {
          if (btn.getAttribute('data-target') === id) {
            btn.textContent = '✅ Copied!';
            setTimeout(() => btn.textContent = '📋 Copy', 2000);
          }
        });
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

}
