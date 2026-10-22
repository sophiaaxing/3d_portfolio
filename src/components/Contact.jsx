import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { SectionWrapper } from '../hoc';

const emptyForm = { name: '', email: '', message: '' };
const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const sending = useRef(false);
  const handleChange = ({ target }) => {
    setForm((previous) => ({ ...previous, [target.name]: target.value }));
    if (status !== 'sending') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending.current) return;
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('invalid');
      return;
    }
    sending.current = true;
    setStatus('sending');
    try {
      await emailjs.send('service_80th60m', 'template_kuxbstt', {
        from_name: form.name.trim(),
        to_name: 'Sophia Xing',
        from_email: form.email.trim(),
        reply_to: form.email.trim(),
        to_email: 'sophiaxing2005@gmail.com',
        message: form.message.trim(),
      }, 'RTcDqeFm_c1YuASBq');
      setForm(emptyForm);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  return (
    <div className="contact-letter max-w-3xl mx-auto relative rounded-[24px] border border-accent/20 bg-[#fffdfb] p-6 sm:p-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Say hello</p>
          <h2 className="editorial-title mt-3 text-4xl sm:text-6xl text-ink">Drop me a note.</h2>
        </div>
        <span className="letter-stamp" aria-hidden="true">♡<small>SX</small></span>
      </div>
      <p className="mt-5 max-w-lg text-secondary leading-7">An idea, an opportunity, or just a hello—I’d love to hear from you.</p>
      <form onSubmit={handleSubmit} className="mt-8" aria-busy={status === 'sending'}>
        <fieldset disabled={status === 'sending'} className="space-y-6 disabled:opacity-70">
          <legend className="sr-only">Send Sophia a message</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">Your name
              <input required autoComplete="name" name="name" maxLength={120} value={form.name} onChange={handleChange} placeholder="Signed by…" className="letter-input" />
            </label>
            <label className="block text-sm font-medium text-ink">Your email
              <input required type="email" autoComplete="email" name="email" maxLength={254} value={form.email} onChange={handleChange} placeholder="So I can write back" className="letter-input" />
            </label>
          </div>
          <label className="block text-sm font-medium text-ink">Your note
            <textarea required name="message" rows={5} maxLength={5000} value={form.message} onChange={handleChange} placeholder="Hi Sophia,…" className="letter-input letter-lines resize-y" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="editorial-title italic text-xl text-secondary">Thanks for stopping by ♡</span>
            <button type="submit" disabled={status === 'sending'} className="scrap-button bg-accent text-white hover:bg-[#853451] disabled:cursor-wait">{status === 'sending' ? 'Sending your note…' : 'Send my note ↗'}</button>
          </div>
        </fieldset>
        <div role="status" aria-live="polite" className="mt-5 text-sm leading-6 text-accent">
          {status === 'success' && 'Your note was sent. Thank you for reaching out!'}
          {status === 'invalid' && 'Please add your name and a message before sending.'}
          {status === 'error' && <>Your note couldn’t be sent. Your draft is still here—please try again or email me below.</>}
        </div>
      </form>
      <p className="mt-4 border-t border-accent/15 pt-5 text-sm text-secondary">Prefer your own stationery? <a className="text-accent underline underline-offset-4" href="mailto:sx25@rice.edu">sx25@rice.edu</a></p>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
