<?php
namespace App\Http\Controllers;

use App\Models\FaqTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqTemplateController extends Controller
{
    public function index()
    {
        $faqs = FaqTemplate::orderBy('sort_order')->get();
        return Inertia::render('Bot/BotFaqIndex', ['faqs' => $faqs]);
    }

    public function create()
    {
        return Inertia::render('Bot/BotFaqCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);
        FaqTemplate::create($validated);
        return redirect()->route('bot.faq')->with('success', 'FAQ berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $faq = FaqTemplate::findOrFail($id);
        return Inertia::render('Bot/BotFaqEdit', ['faq' => $faq]);
    }

    public function update(Request $request, $id)
    {
        $faq = FaqTemplate::findOrFail($id);
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'is_active' => 'boolean',
        ]);
        $faq->update($validated);
        return redirect()->route('bot.faq')->with('success', 'FAQ berhasil diperbarui!');
    }

    public function destroy($id)
    {
        FaqTemplate::findOrFail($id)->delete();
        return redirect()->route('bot.faq')->with('success', 'FAQ berhasil dihapus!');
    }
}
