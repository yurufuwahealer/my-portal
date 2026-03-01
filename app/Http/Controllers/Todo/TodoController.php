<?php

namespace App\Http\Controllers\Todo;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Todo/Index');
    }
}
