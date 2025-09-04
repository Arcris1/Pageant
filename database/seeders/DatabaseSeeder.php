<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin Users
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Judge Users
        User::factory()->create([
            'name' => 'Judge Maria Santos',
            'email' => 'judge1@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
        ]);

        User::factory()->create([
            'name' => 'Judge Roberto Cruz',
            'email' => 'judge2@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
        ]);

        User::factory()->create([
            'name' => 'Judge Ana Reyes',
            'email' => 'judge3@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
        ]);

        User::factory()->create([
            'name' => 'Judge Carlos Mendoza',
            'email' => 'judge4@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
        ]);

        User::factory()->create([
            'name' => 'Judge Isabella Torres',
            'email' => 'judge5@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
        ]);

        // Create Organizer/Staff Users
        User::factory()->create([
            'name' => 'Event Organizer',
            'email' => 'organizer@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'organizer',
        ]);

        User::factory()->create([
            'name' => 'Staff Member 1',
            'email' => 'staff1@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);

        User::factory()->create([
            'name' => 'Staff Member 2',
            'email' => 'staff2@pageant.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);

        // Create Test User for general testing
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create additional random users using factory
        User::factory(15)->create([
            'role' => 'user',
        ]);

        // Create additional random judges
        User::factory(5)->create([
            'role' => 'judge',
        ]);
    }
}
