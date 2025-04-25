import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  messages: Message[] = [];
  userInput = '';
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  private apiKey = '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'; // Remember to secure this properly
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message to chat
    this.addMessage(this.userInput, 'user');
    const prompt = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': '<YOUR_SITE_URL>',
      'X-Title': '<whan>',
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
        const botResponse = response.choices?.[0]?.message?.content || "I didn't get that";
        this.addMessage(botResponse, 'bot');
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
    this.messages.push({
      content,
      sender,
      timestamp: new Date()
    });
  }
}
