"""
Awaaz AI - Command Line Interface
Unified CLI for all voice generation features
"""

import argparse
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    parser = argparse.ArgumentParser(
        prog='awaaz',
        description='🎙️ Awaaz AI - Urdu Voice Generation CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  awaaz tts "ہیلو، آپ کیسے ہیں؟" -o hello.mp3
  awaaz stt recording.mp3
  awaaz sts input.mp3 --voice-id YOUR_VOICE_ID
  awaaz clone "My Voice" sample.mp3
  awaaz voices
  awaaz analytics
  awaaz server
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # TTS Command
    tts_parser = subparsers.add_parser('tts', help='Text to Speech')
    tts_parser.add_argument('text', help='Text to convert to speech')
    tts_parser.add_argument('-o', '--output', default='output.mp3', help='Output file path')
    tts_parser.add_argument('-v', '--voice-id', help='Voice ID to use')
    tts_parser.add_argument('--stream', action='store_true', help='Stream audio output')
    
    # STT Command
    stt_parser = subparsers.add_parser('stt', help='Speech to Text')
    stt_parser.add_argument('audio', help='Audio file to transcribe')
    stt_parser.add_argument('-l', '--language', default='Urdu', help='Language (default: Urdu)')
    stt_parser.add_argument('-o', '--output', help='Save transcription to file')
    stt_parser.add_argument('--translate', action='store_true', help='Also translate to English')
    stt_parser.add_argument('--summarize', action='store_true', help='Summarize the audio')
    
    # STS Command
    sts_parser = subparsers.add_parser('sts', help='Speech to Speech')
    sts_parser.add_argument('audio', help='Source audio file')
    sts_parser.add_argument('-v', '--voice-id', required=True, help='Target voice ID')
    sts_parser.add_argument('-o', '--output', default='converted.mp3', help='Output file path')
    
    # Clone Command
    clone_parser = subparsers.add_parser('clone', help='Clone a voice')
    clone_parser.add_argument('name', help='Name for the cloned voice')
    clone_parser.add_argument('samples', nargs='+', help='Audio sample file(s)')
    
    # Voices Command
    voices_parser = subparsers.add_parser('voices', help='List available voices')
    voices_parser.add_argument('--delete', help='Delete a voice by ID')
    
    # Analytics Command
    analytics_parser = subparsers.add_parser('analytics', help='Show usage analytics')
    analytics_parser.add_argument('--json', action='store_true', help='Output as JSON')
    
    # Server Command
    server_parser = subparsers.add_parser('server', help='Start the API server')
    server_parser.add_argument('-p', '--port', type=int, default=8000, help='Port (default: 8000)')
    server_parser.add_argument('--host', default='0.0.0.0', help='Host (default: 0.0.0.0)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Execute commands
    if args.command == 'tts':
        cmd_tts(args)
    elif args.command == 'stt':
        cmd_stt(args)
    elif args.command == 'sts':
        cmd_sts(args)
    elif args.command == 'clone':
        cmd_clone(args)
    elif args.command == 'voices':
        cmd_voices(args)
    elif args.command == 'analytics':
        cmd_analytics(args)
    elif args.command == 'server':
        cmd_server(args)


def cmd_tts(args):
    """Text to Speech command"""
    from execution.tts import text_to_speech, text_to_speech_stream
    
    print(f"🎤 Converting text to speech...")
    print(f"   Text: {args.text[:50]}{'...' if len(args.text) > 50 else ''}")
    
    try:
        if args.stream:
            audio = text_to_speech_stream(args.text, args.voice_id)
        else:
            audio = text_to_speech(args.text, args.voice_id)
        
        with open(args.output, 'wb') as f:
            f.write(audio)
        
        print(f"✅ Saved to: {args.output}")
        print(f"   Size: {len(audio):,} bytes")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_stt(args):
    """Speech to Text command"""
    from execution.stt import speech_to_text, transcribe_with_translation, summarize_audio
    
    print(f"🎧 Transcribing audio...")
    print(f"   File: {args.audio}")
    
    try:
        if args.translate:
            result = transcribe_with_translation(args.audio, args.language)
            print(f"\n📝 Transcription ({args.language}):")
            print(result['transcription'])
            print(f"\n🌐 Translation (English):")
            print(result['translation'])
            text = f"Transcription:\n{result['transcription']}\n\nTranslation:\n{result['translation']}"
            
        elif args.summarize:
            result = summarize_audio(args.audio, args.language)
            print(f"\n📋 Summary:")
            print(result)
            text = result
            
        else:
            result = speech_to_text(args.audio, args.language, return_metadata=True)
            print(f"\n📝 Transcription:")
            print(result['text'])
            print(f"\n📊 Stats: {result['audio_duration_seconds']:.1f}s, ~{result['estimated_input_tokens']} tokens")
            text = result['text']
        
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"\n💾 Saved to: {args.output}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_sts(args):
    """Speech to Speech command"""
    from execution.sts import speech_to_speech
    
    print(f"🔄 Converting voice...")
    print(f"   Source: {args.audio}")
    print(f"   Target Voice: {args.voice_id}")
    
    try:
        audio = speech_to_speech(args.audio, args.voice_id)
        
        with open(args.output, 'wb') as f:
            f.write(audio)
        
        print(f"✅ Saved to: {args.output}")
        print(f"   Size: {len(audio):,} bytes")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_clone(args):
    """Clone voice command"""
    from execution.clone_voice import clone_voice
    
    print(f"👤 Cloning voice: {args.name}")
    print(f"   Samples: {', '.join(args.samples)}")
    
    try:
        result = clone_voice(args.name, args.samples)
        
        print(f"\n✅ Voice cloned successfully!")
        print(f"   Voice ID: {result['voice_id']}")
        print(f"\n💡 Use this Voice ID with TTS and STS commands")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_voices(args):
    """List/manage voices command"""
    from execution.clone_voice import list_voices, delete_voice
    
    if args.delete:
        print(f"🗑️ Deleting voice: {args.delete}")
        try:
            delete_voice(args.delete)
            print("✅ Voice deleted")
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)
        return
    
    print("📋 Available Voices:\n")
    
    try:
        voices = list_voices()
        
        cloned = [v for v in voices if v.get('category') == 'cloned']
        premade = [v for v in voices if v.get('category') != 'cloned']
        
        if cloned:
            print("🎭 Cloned Voices:")
            for v in cloned:
                print(f"   {v['name']}: {v['voice_id']}")
        
        print(f"\n🎤 Premade Voices: ({len(premade)} available)")
        for v in premade[:5]:
            print(f"   {v['name']}: {v['voice_id']}")
        if len(premade) > 5:
            print(f"   ... and {len(premade) - 5} more")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_analytics(args):
    """Show analytics command"""
    from execution.analytics import get_admin_dashboard
    import json
    
    print("📊 Awaaz AI Analytics\n")
    
    try:
        data = get_admin_dashboard()
        
        if args.json:
            print(json.dumps(data, indent=2))
            return
        
        # ElevenLabs
        if data.get('elevenlabs') and not data['elevenlabs'].get('error'):
            el = data['elevenlabs']
            print("🎤 ELEVENLABS")
            print(f"   Plan: {el['subscription']['plan']} ({el['subscription']['monthly_cost']}/month)")
            print(f"   Credits: {el['credits']['used']:,} / {el['credits']['limit']:,} ({el['credits']['usage_percent']}%)")
            print(f"   Remaining: {el['credits']['remaining']:,}")
            print(f"   Reset: {el['subscription']['next_reset']} ({el['subscription']['days_until_reset']} days)")
        
        # Gemini
        if data.get('gemini') and not data['gemini'].get('error'):
            gm = data['gemini']
            print(f"\n🤖 GEMINI")
            print(f"   Model: {gm['model']}")
            print(f"   Total Requests: {gm['usage']['total_requests']}")
            print(f"   Audio Processed: {gm['usage']['audio_processed_minutes']:.1f} min")
            print(f"   Today: {gm['today']['requests']} / 1,500 free")
            print(f"   Cost: {gm['costs']['total_cost']}")
        
        # Alerts
        if data.get('alerts'):
            print(f"\n⚠️ ALERTS:")
            for alert in data['alerts']:
                print(f"   [{alert['level'].upper()}] {alert['message']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def cmd_server(args):
    """Start API server command"""
    import uvicorn
    
    print(f"\n🎤 Starting Awaaz AI Backend Server...")
    print(f"📍 API: http://localhost:{args.port}")
    print(f"📚 Docs: http://localhost:{args.port}/docs")
    print(f"📊 Admin: http://localhost:{args.port}/api/admin/analytics?admin_key=admin123\n")
    
    uvicorn.run("server:app", host=args.host, port=args.port, reload=True)


if __name__ == '__main__':
    main()
